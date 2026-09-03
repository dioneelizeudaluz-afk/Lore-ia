import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, context, conversation } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt é obrigatório' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ 
      error: 'AI Engine não configurado. Adicione GEMINI_API_KEY no ambiente do servidor.' 
    });
  }

  try {
    const systemPrompt = 'Você é o LORE IA, um assistente de desenvolvimento de software.\nVocê está analisando um projeto real do GitHub.\n\nCONTEXTO DO PROJETO:\n' + JSON.stringify(context, null, 2) + '\n\nREGRAS:\n1. NÃO altere nenhum arquivo.\n2. NÃO crie commits.\n3. Apenas ANALISE e crie um PLANO.\n4. Identifique os arquivos relevantes para o pedido.\n5. Explique a estrutura do projeto quando solicitado.\n6. Responda em português.\n7. Seja objetivo e organizado.\n8. Mostre o plano de alteração quando o usuário pedir mudanças.\n9. Indique o risco de cada alteração.\n10. NUNCA execute comandos ou código.\n\nCONVERSA ANTERIOR:\n' + JSON.stringify(conversation || [], null, 2);

    const fullPrompt = systemPrompt + '\n\nPEDIDO DO USUÁRIO:\n' + prompt;

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=' + apiKey,
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
            temperature: 0.7,
            maxOutputTokens: 2000,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ 
        error: errorData.error?.message || 'Erro ao contactar o Gemini' 
      });
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sem resposta';

    return res.status(200).json({ response: aiResponse });
  } catch (error) {
    console.error('AI Engine error:', error);
    return res.status(500).json({ 
      error: 'Não foi possível contactar o AI Engine. Verifique a configuração da API.' 
    });
  }
        }
