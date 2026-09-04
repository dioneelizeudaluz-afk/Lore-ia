import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, context, conversation, mode } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt é obrigatório' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ 
      error: 'Gemini não configurado.' 
    });
  }

  try {
    let systemPrompt = '';

    if (mode === 'modify') {
      systemPrompt = 'Você é um programador. Crie código para: ' + prompt + '\n\nResponda APENAS JSON: {"summary":"breve","files":[{"path":"src/arquivo.tsx","action":"create","originalContent":"","newContent":"código"}]}\n\nCONTEXTO: ' + JSON.stringify(context).substring(0, 1500);
    } else {
      systemPrompt = 'Responda em português: ' + prompt;
    }

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 8000,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      const errorMsg = errorData.error?.message || 'Erro';
      return res.status(response.status).json({ error: errorMsg });
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (aiResponse.trim().length > 0) {
      return res.status(200).json({ response: aiResponse });
    }

    return res.status(500).json({ error: 'Resposta vazia.' });

  } catch (error) {
    return res.status(500).json({ error: 'Erro de conexão.' });
  }
    }
