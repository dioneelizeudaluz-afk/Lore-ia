import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, context, conversation, mode } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt é obrigatório' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ 
      error: 'OpenRouter não configurado.' 
    });
  }

  try {
    let systemPrompt = '';

    if (mode === 'modify') {
      systemPrompt = `Você é um programador. Crie código para o pedido.
Responda APENAS JSON: {"summary":"breve","files":[{"path":"src/arquivo.tsx","action":"create","originalContent":"","newContent":"código"}]}
CONTEXTO: ${JSON.stringify(context).substring(0, 1500)}`;
    } else {
      systemPrompt = `Responda em português.
CONTEXTO: ${JSON.stringify(context).substring(0, 1000)}`;
    }

    const fullPrompt = systemPrompt + '\n\nPEDIDO:\n' + prompt;

    // Modelos gratuitos CONFIRMADOS do OpenRouter
    const models = [
      'google/gemini-2.0-flash-exp:free',
      'meta-llama/llama-3.2-3b-instruct:free',
      'mistralai/mistral-7b-instruct:free',
      'openchat/openchat-7b:free',
      'qwen/qwen-2.5-7b-instruct:free',
      'deepseek/deepseek-chat:free',
    ];

    let aiResponse = '';
    let lastError = '';

    for (const model of models) {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': 'https://lore-ia.vercel.app',
            'X-Title': 'Lore-IA',
          },
          body: JSON.stringify({
            model: model,
            messages: [{ role: 'user', content: fullPrompt }],
            max_tokens: 8000,
            temperature: 0.2,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          aiResponse = data.choices?.[0]?.message?.content || '';
          if (aiResponse.trim().length > 0) break;
        } else {
          const errorData = await response.json();
          lastError = errorData.error?.message || 'Erro';
        }
      } catch (err) {
        lastError = 'Erro de conexão';
      }
    }

    if (aiResponse.trim().length > 0) {
      return res.status(200).json({ response: aiResponse });
    }

    return res.status(500).json({ 
      error: 'Todos os modelos falharam. Último erro: ' + lastError.substring(0, 80)
    });

  } catch (error) {
    return res.status(500).json({ error: 'Erro interno.' });
  }
              }
