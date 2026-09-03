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

REGRAS PARA MODIFICAÇÃO:
1. Responda APENAS com JSON válido no seguinte formato:
{
  "summary": "Descrição curta da alteração",
  "files": [
    {
      "path": "caminho/completo/do/arquivo",
      "action": "modify" | "create" | "delete",
      "originalContent": "conteúdo original completo",
      "newContent": "novo conteúdo completo"
    }
  ]
}

2. NÃO use markdown, NÃO use comentários, APENAS JSON.
3. Preserve imports, funções e lógica existente.
4. Altere SOMENTE o necessário.
5. NÃO reescreva arquivos inteiros se uma mudança parcial bastar.
6. NÃO crie comandos, scripts ou código malicioso.
7. Para criar arquivo, use action: "create" e originalContent: "".
8. Para excluir, use action: "delete" e newContent: "".
9. Verifique se o JSON está completo e válido.

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

    const fullPrompt = systemPrompt + '\n\nPEDIDO DO USUÁRIO:\n' + prompt;

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
      const errorData = await response.json();
      return res.status(response.status).json({ 
        error: errorData.error?.message || 'Erro ao contactar o Gemini' 
      });
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sem resposta';

    return res.status(200).json({ response: aiResponse });
  } catch (error) {
    console.error('AI Engine error:', error);
    return res.status(500).json({ 
      error: 'Não foi possível contactar o AI Engine.' 
    });
  }
  }
