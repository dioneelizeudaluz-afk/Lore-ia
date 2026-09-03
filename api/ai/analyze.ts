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
      systemPrompt = `Você é o LORE IA, um PROGRAMADOR EXPERT que cria código completo e funcional.

O usuário NÃO sabe programar. Ele vai pedir coisas em linguagem simples.

VOCÊ DEVE:
1. Entender o que o usuário quer
2. Descobrir quais arquivos precisa criar ou modificar
3. Criar arquivos COMPLETOS e FUNCIONAIS
4. Se o usuário pedir "pagamento", crie sistema de pagamento
5. Se pedir "login", crie sistema de login
6. Se pedir "banco de dados", crie banco de dados
7. Se pedir "botão", crie o componente botão
8. NUNCA diga que não pode fazer
9. SEMPRE crie os arquivos necessários

CONTEXTO DO PROJETO:
${JSON.stringify(context, null, 2)}

CONTEÚDO DOS ARQUIVOS:
${JSON.stringify(context.fileContents || {}, null, 2)}

FORMATO OBRIGATÓRIO DA RESPOSTA:
Responda APENAS com JSON. Nada de texto extra.

FORMATO:
{"summary":"o que foi feito","files":[{"path":"caminho/arquivo","action":"create","originalContent":"","newContent":"CONTEÚDO COMPLETO DO ARQUIVO"}]}

REGRAS:
1. APENAS JSON
2. Cada arquivo deve ter conteúdo COMPLETO e FUNCIONAL
3. Use imports corretos
4. Use TypeScript
5. Use React
6. Use cores: #0a0a0f (preto), #8b5cf6 (roxo)
7. Crie TODOS os arquivos necessários
8. Se precisar de banco de dados, use Supabase
9. Se precisar de pagamento, use Stripe
10. Se precisar de autenticação, use Supabase Auth

CONVERSA ANTERIOR:
${JSON.stringify(conversation || [], null, 2)}`;
    } else {
      systemPrompt = `Você é o LORE IA, um assistente de desenvolvimento.

O usuário NÃO sabe programar. Explique em linguagem SIMPLES.

CONTEXTO DO PROJETO:
${JSON.stringify(context, null, 2)}

CONVERSA ANTERIOR:
${JSON.stringify(conversation || [], null, 2)}`;
    }

    const fullPrompt = systemPrompt + '\n\nPEDIDO DO USUÁRIO (linguagem simples):\n' + prompt + '\n\nINTERPRETE O PEDIDO E CRIE OS ARQUIVOS NECESSÁRIOS. Responda APENAS com JSON.';

    let aiResponse = '';
    let usedModel = '';

    // Tenta Hy3 primeiro para código
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
          if (hy3Content.includes('{') && hy3Content.includes('"files"')) {
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
        if (geminiContent.includes('{') && geminiContent.includes('"files"')) {
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
      error: 'A IA não conseguiu gerar uma resposta. Tente reformular o pedido.' 
    });

  } catch (error) {
    console.error('AI Engine error:', error);
    return res.status(500).json({ 
      error: 'Não foi possível contactar o AI Engine.' 
    });
  }
                                 }
