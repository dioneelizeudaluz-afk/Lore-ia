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

VOCÊ DEVE:
1. Entender exatamente o que o usuário quer
2. Criar TODOS os arquivos necessários
3. Retornar APENAS JSON válido

FORMATO OBRIGATÓRIO DA RESPOSTA:
{"summary":"breve descrição do que foi feito","files":[{"path":"src/arquivo.tsx","action":"create","originalContent":"","newContent":"CÓDIGO COMPLETO DO ARQUIVO"}]}

REGRAS CRÍTICAS:
1. Responda APENAS JSON puro
2. NADA de markdown
3. NADA de texto antes ou depois do JSON
4. O JSON começa com { e termina com }
5. Cada arquivo deve ter conteúdo COMPLETO e FUNCIONAL
6. Use TypeScript e React
7. Use cores: #0a0a0f (preto) e #8b5cf6 (roxo)
8. Se o pedido for complexo, crie MÚLTIPLOS arquivos
9. NUNCA responda com texto explicativo
10. SEMPRE responda com JSON

CONTEXTO DO PROJETO:
${JSON.stringify(context).substring(0, 2000)}

CONTEÚDO DOS ARQUIVOS:
${JSON.stringify(context.fileContents || {}).substring(0, 2000)}`;
    } else {
      systemPrompt = `Você é o LORE IA, um assistente de desenvolvimento.

O usuário NÃO sabe programar.

CONTEXTO DO PROJETO:
${JSON.stringify(context).substring(0, 2000)}

Responda em português de forma simples e objetiva.`;
    }

    const fullPrompt = systemPrompt + '\n\nPEDIDO DO USUÁRIO:\n' + prompt + '\n\nLEMBRE-SE: Responda APENAS com JSON válido no formato exato.';

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

    if (!response.ok) {
      const errorData = await response.json();
      const errorMsg = errorData.error?.message || 'Erro ao contactar Gemini';
      
      if (errorMsg.includes('high demand') || errorMsg.includes('overloaded')) {
        return res.status(500).json({ 
          error: 'Gemini sobrecarregado. Aguarde 2 minutos e tente novamente.' 
        });
      }
      
      return res.status(response.status).json({ error: errorMsg });
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (aiResponse && aiResponse.trim().length > 0) {
      return res.status(200).json({ response: aiResponse });
    }

    return res.status(500).json({ 
      error: 'Gemini retornou resposta vazia. Tente novamente.' 
    });

  } catch (error) {
    console.error('Gemini error:', error);
    return res.status(500).json({ 
      error: 'Erro de conexão com Gemini. Tente novamente.' 
    });
  }
                 }
