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

    // Lista de modelos para tentar
    const models = [
      'llama-3.1-8b-instant',
      'llama3-8b-8192',
      'llama3-70b-8192',
      'mixtral-8x7b-32768',
      'gemma2-9b-it',
      'gemma-7b-it',
      'llama-3.1-70b-versatile',
      'llama-3.3-70b-versatile',
      'llama-3.2-3b-preview',
      'llama-3.2-11b-vision-preview',
    ];

    let aiResponse = '';
    let lastError = '';

    for (const model of models) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: model,
            messages: [
              { role: 'user', content: fullPrompt }
            ],
            max_tokens: 8000,
            temperature: 0.2,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          aiResponse = data.choices?.[0]?.message?.content || '';
          if (aiResponse && aiResponse.trim().length > 0) {
            break;
          }
        } else {
          const errorData = await response.json();
          lastError = errorData.error?.message || 'Erro';
        }
      } catch (err) {
        lastError = 'Erro de conexão';
      }
    }

    if (aiResponse && aiResponse.trim().length > 0) {
      return res.status(200).json({ response: aiResponse });
    }

    return res.status(500).json({ 
      error: 'Nenhum modelo Groq disponível. Erro: ' + lastError.substring(0, 100)
    });

  } catch (error) {
    return res.status(500).json({ 
      error: 'Erro de conexão com Groq.' 
    });
  }
  }
