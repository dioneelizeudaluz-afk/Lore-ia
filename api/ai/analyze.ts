import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, context, conversation, mode } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt é obrigatório' });
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;
  const hy3ApiKey = process.env.HY3_API_KEY;

  if (!geminiApiKey && !hy3ApiKey) {
    return res.status(500).json({ 
      error: 'Nenhum AI Engine configurado. Adicione GEMINI_API_KEY ou HY3_API_KEY.' 
    });
  }

  try {
    let systemPrompt = '';

    if (mode === 'modify') {
      systemPrompt = `Você é o LORE IA, um agente de programação que MODIFICA código.

CONTEXTO DO PROJETO:
${JSON.stringify(context, null, 2)}

CONTEÚDO DOS ARQUIVOS RELEVANTES:
${JSON.stringify(context.fileContents || {}, null, 2)}

IMPORTANTE - FORMATO DA RESPOSTA:
Você DEVE responder APENAS com JSON puro, sem markdown, sem código, sem explicações.

O JSON DEVE ter EXATAMENTE este formato:
{"summary":"descrição curta","files":[{"path":"caminho/do/arquivo","action":"modify","originalContent":"conteúdo original","newContent":"conteúdo novo"}]}

REGRAS:
1. Responda APENAS JSON.
2. NÃO use crases.
3. NÃO use markdown.
4. O JSON deve começar com { e terminar com }.
5. Para criar arquivo, use action: "create" e originalContent: "".
6. Para excluir, use action: "delete" e newContent: "".
7. Preserve imports e lógica existente.
8. Altere SOMENTE o necessário.

CONVERSA ANTERIOR:
${JSON.stringify(conversation || [], null, 2)}`;
    } else {
      systemPrompt = `Você é o LORE IA, um assistente de desenvolvimento de software.

CONTEXTO DO PROJETO:
${JSON.stringify(context, null, 2)}

REGRAS:
1. NÃO altere nenhum arquivo.
2. Apenas ANALISE e crie um PLANO.
3. Responda em português.
4. Seja objetivo e organizado.

CONVERSA ANTERIOR:
${JSON.stringify(conversation || [], null, 2)}`;
    }

    const fullPrompt = systemPrompt + '\n\nPEDIDO DO USUÁRIO:\n' + prompt;

    let aiResponse = '';
    let usedModel = '';

    // Se modo modify, tenta Hy3 primeiro (especialista em código)
    if (mode === 'modify' && hy3ApiKey) {
      try {
        const hy3Response = await fetch('https://api.hy3.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${hy3ApiKey}`,
          },
          body: JSON.stringify({
            model: 'hy3-coder',
            messages: [
              { role: 'user', content: fullPrompt }
            ],
            max_tokens: 8000,
            temperature: 0.3,
          }),
        });

        if (hy3Response.ok) {
          const hy3Data = await hy3Response.json();
          aiResponse = hy3Data.choices?.[0]?.message?.content || '';
          usedModel = 'hy3';
        }
      } catch (err) {
        console.log('Hy3 falhou, tentando Gemini...');
      }
    }

    // Se Hy3 falhou ou não foi usado, usa Gemini
    if (!aiResponse && geminiApiKey) {
      const geminiResponse = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=' + geminiApiKey,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: fullPrompt }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 8000,
            },
          }),
        }
      );

      if (geminiResponse.ok) {
        const geminiData = await geminiResponse.json();
        aiResponse = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
        usedModel = 'gemini';
      }
    }

    // Se modo analyze e Hy3 está disponível, usa Hy3 para análise de código
    if (!aiResponse && hy3ApiKey) {
      try {
        const hy3Response = await fetch('https://api.hy3.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${hy3ApiKey}`,
          },
          body: JSON.stringify({
            model: 'hy3-coder',
            messages: [
              { role: 'user', content: fullPrompt }
            ],
            max_tokens: 8000,
            temperature: 0.3,
          }),
        });

        if (hy3Response.ok) {
          const hy3Data = await hy3Response.json();
          aiResponse = hy3Data.choices?.[0]?.message?.content || '';
          usedModel = 'hy3';
        }
      } catch (err) {
        console.log('Hy3 fallback falhou');
      }
    }

    if (aiResponse) {
      return res.status(200).json({ 
        response: aiResponse,
        model: usedModel,
      });
    }

    return res.status(500).json({ 
      error: 'Nenhum modelo de IA disponível. Tente novamente em alguns minutos.' 
    });

  } catch (error) {
    console.error('AI Engine error:', error);
    return res.status(500).json({ 
      error: 'Não foi possível contactar o AI Engine.' 
    });
  }
              }
