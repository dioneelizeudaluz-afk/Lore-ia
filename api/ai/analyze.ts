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
      systemPrompt = `Você é o LORE IA, um programador expert que cria código completo e funcional.
O usuário NÃO sabe programar. Ele fala em linguagem simples.
Responda APENAS com JSON válido.
FORMATO: {"summary":"breve","files":[{"path":"src/arquivo.tsx","action":"create","originalContent":"","newContent":"CÓDIGO COMPLETO"}]}
CONTEXTO: ${JSON.stringify(context).substring(0, 1500)}`;
    } else {
      systemPrompt = `Você é o LORE IA, um assistente. Responda em português simples.
CONTEXTO: ${JSON.stringify(context).substring(0, 1000)}`;
    }

    const fullPrompt = systemPrompt + '\n\nPEDIDO:\n' + prompt;

    let lastError = '';
    
    // Tenta até 3 vezes com espera
    for (let attempt = 0; attempt < 3; attempt++) {
      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=' + apiKey,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: fullPrompt }] }],
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

      const errorData = await response.json();
      lastError = errorData.error?.message || 'Erro';
      
      // Se for limite de requisições, aguarda
      if (lastError.includes('Quota exceeded') || lastError.includes('retry in')) {
        const retryMatch = lastError.match(/retry in ([\d.]+)s/);
        const waitTime = retryMatch ? parseFloat(retryMatch[1]) * 1000 : 20000;
        await new Promise(resolve => setTimeout(resolve, Math.min(waitTime, 30000)));
        continue;
      }
      
      break;
    }

    return res.status(500).json({ 
      error: 'Gemini está limitando requisições. Aguarde 30 segundos e tente novamente.' 
    });

  } catch (error) {
    return res.status(500).json({ 
      error: 'Erro de conexão. Tente novamente.' 
    });
  }
  }
