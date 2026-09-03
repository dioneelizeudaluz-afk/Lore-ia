import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, context, conversation, mode } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt é obrigatório' });
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;
  const hy3ApiKey = process.env.HY3_API_KEY;

  if (!geminiApiKey && !hy3ApiKey) {
    return res.status(500).json({ 
      error: 'Nenhum AI Engine configurado.' 
    });
  }

  try {
    let systemPrompt = '';

    if (mode === 'modify') {
      systemPrompt = `Você é um programador que cria código. O usuário não sabe programar.

O usuário vai pedir algo em linguagem simples. Você deve:
1. Entender o pedido
2. Criar os arquivos necessários
3. Retornar JSON

FORMATO JSON OBRIGATÓRIO:
{"summary":"breve","files":[{"path":"src/arquivo.tsx","action":"create","originalContent":"","newContent":"código completo"}]}

Exemplo de resposta:
{"summary":"Criar página","files":[{"path":"src/pages/NovaPagina.tsx","action":"create","originalContent":"","newContent":"import React from 'react'; export default function NovaPagina() { return <div>Nova Página</div>; }"}]}

CONTEXTO:
${JSON.stringify(context).substring(0, 2000)}

CONVERSA:
${JSON.stringify(conversation || []).substring(0, 1000)}`;
    } else {
      systemPrompt = `Você é um assistente. Responda em português de forma simples.

CONTEXTO:
${JSON.stringify(context).substring(0, 2000)}`;
    }

    const fullPrompt = systemPrompt + '\n\nPEDIDO:\n' + prompt;

    let aiResponse = '';

    // Tenta Gemini
    if (geminiApiKey) {
      try {
        const geminiResponse = await fetch(
          'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=' + geminiApiKey,
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

        if (geminiResponse.ok) {
          const geminiData = await geminiResponse.json();
          aiResponse = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
        }
      } catch (err) {
        console.log('Gemini falhou');
      }
    }

    // Se Gemini falhou, tenta Hy3
    if (!aiResponse && hy3ApiKey) {
      try {
        const hy3Response = await fetch('https://api.hy3.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${hy3ApiKey}`,
          },
          body: JSON.stringify({
            model: 'hy3-coder',
            messages: [{ role: 'user', content: fullPrompt }],
            max_tokens: 8000,
            temperature: 0.2,
          }),
        });

        if (hy3Response.ok) {
          const hy3Data = await hy3Response.json();
          aiResponse = hy3Data.choices?.[0]?.message?.content || '';
        }
      } catch (err) {
        console.log('Hy3 falhou');
      }
    }

    if (aiResponse) {
      return res.status(200).json({ response: aiResponse });
    }

    return res.status(500).json({ 
      error: 'Nenhum modelo de IA respondeu. Tente novamente.' 
    });

  } catch (error) {
    console.error('AI Engine error:', error);
    return res.status(500).json({ 
      error: 'Erro interno. Tente novamente.' 
    });
  }
      }
