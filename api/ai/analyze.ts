import type { VercelRequest, VercelResponse } from '@vercel/node';

// AI Router - Decide qual modelo usar
function shouldUseHy3(prompt: string, mode: string): boolean {
  const codeKeywords = [
    'código', 'code', 'corrig', 'fix', 'debug', 'erro', 'error',
    'refator', 'implement', 'criar função', 'criar componente',
    'create function', 'create component', 'bug', 'programação',
    'programming', 'javascript', 'typescript', 'react', 'vue',
    'angular', 'html', 'css', 'api', 'banco de dados', 'database',
  ];

  const lowerPrompt = prompt.toLowerCase();

  if (mode === 'modify') {
    return true; // Modificação de código sempre usa Hy3
  }

  return codeKeywords.some(keyword => lowerPrompt.includes(keyword));
}

// Gemini Provider
async function callGemini(apiKey: string, fullPrompt: string): Promise<string> {
  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=' + apiKey,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: fullPrompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 8000,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Gemini API error: ' + response.status);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// Hy3 Provider
async function callHy3(apiKey: string, fullPrompt: string): Promise<string> {
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
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    throw new Error('Hy3 API error: ' + response.status);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, context, conversation, mode, useHy3 } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt é obrigatório' });
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;
  const hy3ApiKey = process.env.HY3_API_KEY;

  if (!geminiApiKey) {
    return res.status(500).json({ 
      error: 'AI Engine não configurado. Adicione GEMINI_API_KEY no ambiente do servidor.' 
    });
  }

  try {
    let systemPrompt = '';

    if (mode === 'modify') {
      systemPrompt = `Você é o LORE IA, um agente de programação que MODIFICA código.

CONTEXTO DO PROJETO:
${JSON.stringify(context, null, 2)}

CONTEÚDO DOS ARQUIVOS RELEVANTES:
${JSON.stringify(context.fileContents || {}, null, 2)}

IMPORTANTE - FORMATO DA RESPOSTA:
Você DEVE responder APENAS com JSON puro, sem markdown, sem código, sem explicações.

O JSON DEVE ter EXATAMENTE este formato:
{"summary":"descrição curta","files":[{"path":"caminho/do/arquivo","action":"modify","originalContent":"conteúdo original","newContent":"conteúdo novo"}]}

EXEMPLO DE RESPOSTA CORRETA:
{"summary":"Mudar fundo para preto","files":[{"path":"src/index.css","action":"modify","originalContent":"body { background: white; }","newContent":"body { background: #000000; }"}]}

REGRAS:
1. Responda APENAS JSON.
2. NÃO use crases.
3. NÃO use markdown.
4. NÃO escreva "Aqui está o JSON".
5. NÃO adicione texto antes ou depois do JSON.
6. O JSON deve começar com { e terminar com }.
7. Para criar arquivo, use action: "create" e originalContent: "".
8. Para excluir, use action: "delete" e newContent: "".
9. Preserve imports e lógica existente.
10. Altere SOMENTE o necessário.

CONVERSA ANTERIOR:
${JSON.stringify(conversation || [], null, 2)}`;
    } else {
      systemPrompt = `Você é o LORE IA, um assistente de desenvolvimento de software.
Você está analisando um projeto real do GitHub.

CONTEXTO DO PROJETO:
${JSON.stringify(context, null, 2)}

REGRAS:
1. NÃO altere nenhum arquivo.
2. NÃO crie commits.
3. Apenas ANALISE e crie um PLANO.
4. Responda em português.
5. Seja objetivo e organizado.

CONVERSA ANTERIOR:
${JSON.stringify(conversation || [], null, 2)}`;
    }

    const fullPrompt = systemPrompt + '\n\nPEDIDO DO USUÁRIO:\n' + prompt + '\n\nLEMBRE-SE: Responda APENAS com JSON válido.';

    let aiResponse = '';
    let usedModel = 'gemini';

    // Decide qual modelo usar
    const routeToHy3 = useHy3 === true || shouldUseHy3(prompt, mode);

    if (routeToHy3 && hy3ApiKey) {
      // Tenta Hy3 primeiro para tarefas de código
      try {
        aiResponse = await callHy3(hy3ApiKey, fullPrompt);
        usedModel = 'hy3';
      } catch (hy3Error) {
        console.log('Hy3 falhou, usando Gemini como fallback');
        // Fallback para Gemini
        aiResponse = await callGemini(geminiApiKey, fullPrompt);
        usedModel = 'gemini';
      }
    } else {
      // Usa Gemini como padrão
      try {
        aiResponse = await callGemini(geminiApiKey, fullPrompt);
        usedModel = 'gemini';
      } catch (geminiError) {
        // Se Gemini falhar e Hy3 estiver disponível
        if (hy3ApiKey && (routeToHy3 || mode === 'modify')) {
          try {
            aiResponse = await callHy3(hy3ApiKey, fullPrompt);
            usedModel = 'hy3';
          } catch (hy3FallbackError) {
            return res.status(500).json({ 
              error: 'Nenhum modelo de IA disponível. Tente novamente em alguns minutos.' 
            });
          }
        } else {
          return res.status(500).json({ 
            error: 'Não foi possível contactar o AI Engine. Tente novamente.' 
          });
        }
      }
    }

    if (aiResponse) {
      return res.status(200).json({ 
        response: aiResponse,
        model: usedModel,
      });
    }

    return res.status(500).json({ 
      error: 'Não foi possível obter resposta do AI Engine.' 
    });

  } catch (error) {
    console.error('AI Engine error:', error);
    return res.status(500).json({ 
      error: 'Não foi possível contactar o AI Engine.' 
    });
  }
    }
