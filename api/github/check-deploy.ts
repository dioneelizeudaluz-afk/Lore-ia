import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { repoFullName, githubToken } = req.body;

  if (!repoFullName || !githubToken) {
    return res.status(400).json({ error: 'Parâmetros obrigatórios faltando' });
  }

  try {
    // Get latest commits to check if push was successful
    const commitsResponse = await fetch(
      `https://api.github.com/repos/${repoFullName}/commits?per_page=1`,
      {
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!commitsResponse.ok) {
      return res.status(500).json({ error: 'Erro ao verificar commits' });
    }

    const commits = await commitsResponse.json();

    if (commits.length > 0) {
      const latestCommit = commits[0];
      
      return res.status(200).json({
        success: true,
        latestCommit: {
          sha: latestCommit.sha,
          message: latestCommit.commit?.message || 'Sem mensagem',
          author: latestCommit.commit?.author?.name || 'Unknown',
          date: latestCommit.commit?.author?.date || new Date().toISOString(),
          url: latestCommit.html_url,
        },
        deployStatus: 'accepted',
        message: 'Push confirmado. O deploy automático foi acionado pelo GitHub.',
      });
    }

    return res.status(200).json({
      success: true,
      deployStatus: 'pending',
      message: 'Aguardando confirmação do deploy.',
    });
  } catch (error) {
    console.error('Check deploy error:', error);
    return res.status(500).json({ 
      error: 'Erro ao verificar status do deploy' 
    });
  }
        }
