import type { VercelRequest, VercelResponse } from '@vercel/node';

interface ProjectContext {
  framework: string;
  language: string;
  structure: string[];
  pages: string[];
  components: string[];
  styles: string[];
  configs: string[];
  dependencies: Record<string, string>;
}

async function fetchFromGitHub(url: string, token: string) {
  const response = await fetch(url, {
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
    },
  });
  return response.json();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { repoFullName, branch, githubToken } = req.body;

  if (!repoFullName || !githubToken) {
    return res.status(400).json({ error: 'Parâmetros obrigatórios faltando' });
  }

  try {
    // Get file tree
    const treeData = await fetchFromGitHub(
      `https://api.github.com/repos/${repoFullName}/git/trees/${branch || 'main'}?recursive=1`,
      githubToken
    );

    if (!treeData.tree) {
      return res.status(404).json({ error: 'Repositório não encontrado' });
    }

    const files = treeData.tree.filter((item: any) => item.type === 'blob');
    
    const context: ProjectContext = {
      framework: 'unknown',
      language: 'unknown',
      structure: [],
      pages: [],
      components: [],
      styles: [],
      configs: [],
      dependencies: {},
    };

    // Detect framework
    if (files.some((f: any) => f.path.includes('next.config'))) {
      context.framework = 'Next.js';
    } else if (files.some((f: any) => f.path.includes('vite.config'))) {
      context.framework = 'Vite';
    } else if (files.some((f: any) => f.path.includes('angular.json'))) {
      context.framework = 'Angular';
    } else if (files.some((f: any) => f.path.includes('vue.config'))) {
      context.framework = 'Vue';
    } else if (files.some((f: any) => f.path.endsWith('.tsx') || f.path.endsWith('.jsx'))) {
      context.framework = 'React';
    }

    // Detect language
    if (files.some((f: any) => f.path.endsWith('.ts') || f.path.endsWith('.tsx'))) {
      context.language = 'TypeScript';
    } else if (files.some((f: any) => f.path.endsWith('.js') || f.path.endsWith('.jsx'))) {
      context.language = 'JavaScript';
    } else if (files.some((f: any) => f.path.endsWith('.html'))) {
      context.language = 'HTML';
    }

    // Categorize files
    files.forEach((file: any) => {
      const path = file.path.toLowerCase();
      
      if (path.includes('package.json')) {
        context.configs.push(file.path);
      } else if (path.includes('/pages/') || path.includes('/src/pages/') || path.includes('/app/')) {
        context.pages.push(file.path);
      } else if (path.includes('/components/') || path.includes('/src/components/')) {
        context.components.push(file.path);
      } else if (path.endsWith('.css') || path.endsWith('.scss') || path.endsWith('.sass') || path.includes('tailwind')) {
        context.styles.push(file.path);
      } else if (path.includes('config') || path.endsWith('.json') || path.endsWith('.config.js') || path.endsWith('.config.ts')) {
        context.configs.push(file.path);
      }
    });

    // Get package.json for dependencies
    const packageJsonFile = files.find((f: any) => f.path === 'package.json');
    if (packageJsonFile) {
      const packageData = await fetchFromGitHub(
        `https://api.github.com/repos/${repoFullName}/contents/package.json?ref=${branch || 'main'}`,
        githubToken
      );
      
      if (packageData.content) {
        const content = Buffer.from(packageData.content, 'base64').toString('utf-8');
        const parsed = JSON.parse(content);
        context.dependencies = {
          ...parsed.dependencies,
          ...parsed.devDependencies,
        };
      }
    }

    // Structure summary
    const directories = new Set<string>();
    files.forEach((file: any) => {
      const parts = file.path.split('/');
      if (parts.length > 1) {
        directories.add(parts[0]);
      }
    });
    context.structure = Array.from(directories).slice(0, 30);

    return res.status(200).json({ context });
  } catch (error) {
    console.error('Project analysis error:', error);
    return res.status(500).json({ error: 'Erro ao analisar projeto' });
  }
      }
