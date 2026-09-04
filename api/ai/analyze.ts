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
      systemPrompt = 'Você é um programador. Crie código para: ' + prompt + '\n\nResponda APENAS JSON: {"summary":"breve","files":[{"path":"src/arquivo.tsx","action":"create","originalContent":"","newContent":"código"}]}\n\nCONTEXTO: ' + JSON.stringify(context).substring(0, 1500);
    } else {
      systemPrompt = 'Responda em português: ' + prompt + '\n\nCONTEXTO: ' + JSON.stringify(context).substring(0, 1000);
    }

    // Lista de modelos gratuitos do Gemini
    const models = [
      'gemini-1.5-flash',
      'gemini-2.0-flash',
      'gemini-1.5-pro',
      'gemini-pro',
    ];

    let aiResponse = '';
    let lastError = '';

    for (const model of models) {
      try {
        const response = await fetch(
          'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent?key=' + apiKey,
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
          aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (aiResponse.trim().length > 0) {
            break;
          }
        } else {
          const errorData = await response.json();
          lastError = errorData.error?.message || 'Erro';
          
          // Se for limite, aguarda e tenta próximo modelo
          if (lastError.includes('Quota') || lastError.includes('quota') || lastError.includes('limit')) {
            continue;
          }
        }
      } catch (err) {
        lastError = 'Erro de conexão';
      }
      
      // Pequena pausa entre tentativas
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    if (aiResponse.trim().length > 0) {
      return res.status(200).json({ response: aiResponse });
    }

    return res.status(500).json({ 
      error: 'Gemini limitado no momento. Aguarde 1 minuto e tente novamente.' 
    });

  } catch (error) {
    return res.status(500).json({ 
      error: 'Erro interno. Tente novamente.' 
    });
  }
  }
