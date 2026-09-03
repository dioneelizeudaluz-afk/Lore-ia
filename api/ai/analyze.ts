import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, context, conversation } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt é obrigatório' });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ 
      error: 'AI Engine não configurado. Adicione DEEPSEEK_API_KEY no ambiente do servidor.' 
    });
  }

  try {
    const systemPrompt = `Você é o LORE IA, um assistente de desenvolvimento de software.
Você está analisando um projeto real do GitHub.

CONTEXTO DO PROJETO:
${JSON.stringify(context, null, 2)}

REGRAS:
1. NÃO altere nenhum arquivo.
2. NÃO crie commits.
3. Apenas ANALISE e crie um PLANO.
4. Identifique os arquivos relevantes para o pedido.
5. Explique a estrutura do projeto quando solicitado.
6. Responda em português.
7. Seja objetivo e organizado.
8. Mostre o plano de alteração quando o usuário pedir mudanças.
9. Indique o risco de cada alteração.
10. NUNCA execute comandos ou código.

CONVERSA ANTERIOR:
${JSON.stringify(conversation || [], null, 2)}`;

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ 
        error: errorData.error?.message || 'Erro ao contactar o DeepSeek' 
      });
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || 'Sem resposta';

    return res.status(200).json({ response: aiResponse });
  } catch (error) {
    console.error('AI Engine error:', error);
    return res.status(500).json({ 
      error: 'Não foi possível contactar o AI Engine. Verifique a configuração da API.' 
    });
  }
          }
