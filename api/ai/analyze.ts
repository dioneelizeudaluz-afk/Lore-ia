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
      error: 'Gemini não configurado. Adicione GEMINI_API_KEY na Vercel.' 
    });
  }

  try {
    let systemPrompt = '';

    if (mode === 'modify') {
      systemPrompt = 'Você é um programador. Crie código para: ' + prompt + '\n\nResponda APENAS com JSON: {"summary":"breve","files":[{"path":"src/arquivo.tsx","action":"create","originalContent":"","newContent":"código"}]}\n\nCONTEXTO: ' + JSON.stringify(context).substring(0, 1500);
    } else {
      systemPrompt = 'Responda em português: ' + prompt + '\n\nCONTEXTO: ' + JSON.stringify(context).substring(0, 1000);
    }

    // Tenta até 5 vezes
    for (let i = 0; i < 5; i++) {
      try {
        const response = await fetch(
          'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=' + apiKey,
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

        if (response.ok) {
          const data = await response.json();
          const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (aiResponse && aiResponse.trim().length > 0) {
            return res.status(200).json({ response: aiResponse });
          }
        }
      } catch (err) {
        // Tenta de novo
      }

      // Espera entre tentativas
      await new Promise(resolve => setTimeout(resolve, 5000 * (i + 1)));
    }

    return res.status(500).json({ 
      error: 'Gemini indisponível no momento. Tente novamente em 1 minuto.' 
    });

  } catch (error) {
    return res.status(500).json({ 
      error: 'Erro no servidor. Tente novamente.' 
    });
  }
          }
