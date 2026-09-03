import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, context, conversation, mode } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt é obrigatório' });
  }

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ 
      error: 'Groq não configurado. Adicione GROQ_API_KEY na Vercel.' 
    });
  }

  try {
    let systemPrompt = '';

    if (mode === 'modify') {
      systemPrompt = `Você é um programador expert. O usuário não sabe programar.
Crie código completo para o pedido.
Responda APENAS com JSON:
{"summary":"breve","files":[{"path":"src/arquivo.tsx","action":"create","originalContent":"","newContent":"CÓDIGO COMPLETO"}]}

CONTEXTO: ${JSON.stringify(context).substring(0, 1500)}`;
    } else {
      systemPrompt = `Responda em português de forma simples.
CONTEXTO: ${JSON.stringify(context).substring(0, 1000)}`;
    }

    const fullPrompt = systemPrompt + '\n\nPEDIDO:\n' + prompt;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
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
        error: errorData.error?.message || 'Erro ao contactar Groq' 
      });
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || '';

    if (aiResponse && aiResponse.trim().length > 0) {
      return res.status(200).json({ response: aiResponse });
    }

    return res.status(500).json({ 
      error: 'Groq retornou resposta vazia. Tente novamente.' 
    });

  } catch (error) {
    return res.status(500).json({ 
      error: 'Erro de conexão com Groq. Tente novamente.' 
    });
  }
      }
