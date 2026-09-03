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
      error: 'Nenhum AI Engine configurado.' 
    });
  }

  try {
    let systemPrompt = '';

    if (mode === 'modify') {
      systemPrompt = `Você é o LORE IA, um agente de programação que MODIFICA código.

CONTEXTO DO PROJETO:
${JSON.stringify(context, null, 2)}

CONTEÚDO DOS ARQUIVOS:
${JSON.stringify(context.fileContents || {}, null, 2)}

FORMATO OBRIGATÓRIO DA RESPOSTA:
Responda APENAS com JSON válido. Nada mais.

FORMATO EXATO:
{"summary":"breve descrição","files":[{"path":"caminho/arquivo","action":"create","originalContent":"","newContent":"conteúdo completo do arquivo"}]}

Para MODIFICAR arquivo existente:
{"summary":"breve descrição","files":[{"path":"caminho/arquivo","action":"modify","originalContent":"","newContent":"novo conteúdo completo"}]}

REGRAS CRÍTICAS:
1. APENAS JSON. Nada de markdown, nada de texto extra.
2. O JSON começa com { e termina com }.
3. Para criar arquivo novo, use action "create".
4. Para modificar arquivo existente, use action "modify".
5. Se o pedido for complexo (criar página, painel, sistema), crie TODOS os arquivos necessários.
6. Cada arquivo no array "files" deve ter conteúdo completo e funcional.
7. NÃO responda com texto explicativo. APENAS JSON.

CONVERSA ANTERIOR:
${JSON.stringify(conversation || [], null, 2)}`;
    } else {
      systemPrompt = `Você é o LORE IA, um assistente de desenvolvimento de software.

CONTEXTO DO PROJETO:
${JSON.stringify(context, null, 2)}

REGRAS:
1. NÃO altere nenhum arquivo.
2. Apenas ANALISE.
3. Responda em português.

CONVERSA ANTERIOR:
${JSON.stringify(conversation || [], null, 2)}`;
    }

    const fullPrompt = systemPrompt + '\n\nPEDIDO DO USUÁRIO:\n' + prompt + '\n\nLEMBRE-SE: Responda APENAS com JSON válido no formato exato especificado.';

    let aiResponse = '';
    let usedModel = '';

    // Tenta Hy3 primeiro para tarefas de código
    if (hy3ApiKey && mode === 'modify') {
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
            temperature: 0.2,
          }),
        });

        if (hy3Response.ok) {
          const hy3Data = await hy3Response.json();
          const hy3Content = hy3Data.choices?.[0]?.message?.content || '';
          if (hy3Content && hy3Content.includes('{') && hy3Content.includes('}')) {
            aiResponse = hy3Content;
            usedModel = 'hy3';
          }
        }
      } catch (err) {
        console.log('Hy3 falhou');
      }
    }

    // Fallback para Gemini
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
              temperature: 0.2,
              maxOutputTokens: 8000,
            },
          }),
        }
      );

      if (geminiResponse.ok) {
        const geminiData = await geminiResponse.json();
        const geminiContent = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (geminiContent && geminiContent.includes('{') && geminiContent.includes('}')) {
          aiResponse = geminiContent;
          usedModel = 'gemini';
        }
      }
    }

    if (aiResponse) {
      return res.status(200).json({ 
        response: aiResponse,
        model: usedModel,
      });
    }

    return res.status(500).json({ 
      error: 'A IA não conseguiu gerar uma resposta válida. Tente simplificar o pedido.' 
    });

  } catch (error) {
    console.error('AI Engine error:', error);
    return res.status(500).json({ 
      error: 'Não foi possível contactar o AI Engine.' 
    });
  }
  }
