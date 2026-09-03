import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, context, conversation, mode } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt é obrigatório' });
  }

  const apiKey = process.env.HY3_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ 
      error: 'Hy3 não configurado. Adicione HY3_API_KEY no ambiente do servidor.' 
    });
  }

  try {
    let systemPrompt = '';

    if (mode === 'modify') {
      systemPrompt = `Você é um programador expert. Crie código completo para o pedido do usuário.

Responda APENAS com JSON válido neste formato:
{"summary":"breve descrição","files":[{"path":"src/arquivo.tsx","action":"create","originalContent":"","newContent":"código completo aqui"}]}

CONTEXTO DO PROJETO:
${JSON.stringify(context).substring(0, 2000)}

CONTEÚDO DOS ARQUIVOS:
${JSON.stringify(context.fileContents || {}).substring(0, 2000)}`;
    } else {
      systemPrompt = `Você é um assistente de desenvolvimento. Responda em português de forma simples.

CONTEXTO DO PROJETO:
${JSON.stringify(context).substring(0, 2000)}`;
    }

    const fullPrompt = systemPrompt + '\n\nPEDIDO DO USUÁRIO:\n' + prompt;

    const response = await fetch('https://api.hy3.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
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

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ 
        error: errorData.error?.message || 'Erro ao contactar Hy3' 
      });
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || '';

    if (aiResponse) {
      return res.status(200).json({ response: aiResponse });
    }

    return res.status(500).json({ 
      error: 'Hy3 não respondeu. Tente novamente.' 
    });

  } catch (error) {
    console.error('Hy3 error:', error);
    return res.status(500).json({ 
      error: 'Erro ao contactar Hy3. Tente novamente.' 
    });
  }
}
