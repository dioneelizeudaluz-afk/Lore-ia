import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { repoFullName, branch, githubToken, message, changes } = req.body;

  if (!repoFullName || !branch || !githubToken || !message || !changes) {
    return res.status(400).json({ error: 'Parâmetros obrigatórios faltando' });
  }

  try {
    // 1. Get current branch reference
    const branchResponse = await fetch(
      `https://api.github.com/repos/${repoFullName}/git/refs/heads/${branch}`,
      {
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!branchResponse.ok) {
      return res.status(404).json({ error: `Branch "${branch}" não encontrada` });
    }

    const branchData = await branchResponse.json();
    const currentCommitSha = branchData.object.sha;

    // 2. Get current commit
    const commitResponse = await fetch(
      `https://api.github.com/repos/${repoFullName}/git/commits/${currentCommitSha}`,
      {
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!commitResponse.ok) {
      return res.status(404).json({ error: 'Commit atual não encontrado' });
    }

    const currentCommit = await commitResponse.json();
    const currentTreeSha = currentCommit.tree.sha;

    // 3. Create blobs for each file
    const treeItems = [];

    for (const change of changes) {
      if (change.action === 'delete') {
        treeItems.push({
          path: change.path,
          mode: '100644',
          type: 'blob',
          sha: null,
        });
      } else {
        const blobResponse = await fetch(
          `https://api.github.com/repos/${repoFullName}/git/blobs`,
          {
            method: 'POST',
            headers: {
              'Authorization': `token ${githubToken}`,
              'Accept': 'application/vnd.github.v3+json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              content: change.content || '',
              encoding: 'utf-8',
            }),
          }
        );

        if (!blobResponse.ok) {
          return res.status(500).json({ error: `Erro ao criar blob para ${change.path}` });
        }

        const blobData = await blobResponse.json();

        treeItems.push({
          path: change.path,
          mode: '100644',
          type: 'blob',
          sha: blobData.sha,
        });
      }
    }

    // 4. Create new tree
    const treeResponse = await fetch(
      `https://api.github.com/repos/${repoFullName}/git/trees`,
      {
        method: 'POST',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          base_tree: currentTreeSha,
          tree: treeItems,
        }),
      }
    );

    if (!treeResponse.ok) {
      return res.status(500).json({ error: 'Erro ao criar árvore de arquivos' });
    }

    const treeData = await treeResponse.json();

    // 5. Create commit
    const newCommitResponse = await fetch(
      `https://api.github.com/repos/${repoFullName}/git/commits`,
      {
        method: 'POST',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          tree: treeData.sha,
          parents: [currentCommitSha],
        }),
      }
    );

    if (!newCommitResponse.ok) {
      const errData = await newCommitResponse.json();
      return res.status(500).json({ error: `Erro ao criar commit: ${errData.message}` });
    }

    const newCommit = await newCommitResponse.json();

    // 6. Update branch reference (PUSH)
    const pushResponse = await fetch(
      `https://api.github.com/repos/${repoFullName}/git/refs/heads/${branch}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sha: newCommit.sha,
          force: false,
        }),
      }
    );

    if (!pushResponse.ok) {
      const errData = await pushResponse.json();
      return res.status(500).json({ error: `Erro ao fazer push: ${errData.message}` });
    }

    // 7. Success
    return res.status(200).json({
      success: true,
      commitSha: newCommit.sha,
      commitUrl: newCommit.html_url || `https://github.com/${repoFullName}/commit/${newCommit.sha}`,
      message: 'Push enviado com sucesso. O deploy automático foi acionado.',
    });
  } catch (error) {
    console.error('Commit and push error:', error);
    return res.status(500).json({ 
      error: 'Erro interno ao processar commit e push' 
    });
  }
}
