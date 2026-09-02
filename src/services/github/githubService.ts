import { Octokit } from '@octokit/rest';
import { 
  GithubRepo, 
  GithubBranch, 
  GithubFile, 
  GithubCommit 
} from '@/types/github';
import { useAppStore } from '@/stores/appStore';

class GithubService {
  private octokit: Octokit | null = null;
  
  constructor() {
    const token = useAppStore.getState().token;
    if (token) {
      this.octokit = new Octokit({ auth: token });
    }
  }

  setToken(token: string) {
    this.octokit = new Octokit({ auth: token });
    useAppStore.getState().setToken(token);
  }

  async getCurrentUser() {
    if (!this.octokit) throw new Error('Não autenticado');
    
    const { data } = await this.octokit.users.getAuthenticated();
    return {
      login: data.login,
      id: data.id,
      avatarUrl: data.avatar_url,
      name: data.name || data.login,
      email: data.email || '',
    };
  }

  async listRepositories(): Promise<GithubRepo[]> {
    if (!this.octokit) throw new Error('Não autenticado');
    
    const { data } = await this.octokit.repos.listForAuthenticatedUser({
      sort: 'updated',
      per_page: 100,
    });

    return data.map(repo => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description || '',
      private: repo.private,
      defaultBranch: repo.default_branch,
      updatedAt: repo.updated_at,
      language: repo.language || 'Unknown',
      htmlUrl: repo.html_url,
    }));
  }

  async listBranches(owner: string, repo: string): Promise<GithubBranch[]> {
    if (!this.octokit) throw new Error('Não autenticado');
    
    const { data } = await this.octokit.repos.listBranches({
      owner,
      repo,
      per_page: 100,
    });

    return data.map(branch => ({
      name: branch.name,
      commit: {
        sha: branch.commit.sha,
      },
    }));
  }

  async getFileContent(
    owner: string,
    repo: string,
    path: string,
    branch: string
  ): Promise<string> {
    if (!this.octokit) throw new Error('Não autenticado');
    
    const { data } = await this.octokit.repos.getContent({
      owner,
      repo,
      path,
      ref: branch,
    });

    if ('content' in data) {
      return Buffer.from(data.content, 'base64').toString('utf-8');
    }
    
    throw new Error('Não é um arquivo');
  }

  async getFileTree(
    owner: string,
    repo: string,
    branch: string
  ): Promise<GithubFile> {
    if (!this.octokit) throw new Error('Não autenticado');
    
    const { data } = await this.octokit.git.getTree({
      owner,
      repo,
      tree_sha: branch,
      recursive: 'true',
    });

    const root: GithubFile = {
      name: repo,
      path: '',
      type: 'dir',
      children: [],
    };

    const buildTree = (items: typeof data.tree): GithubFile[] => {
      const tree: GithubFile[] = [];
      const map = new Map<string, GithubFile>();

      items
        .filter(item => item.type === 'blob' || item.type === 'tree')
        .forEach(item => {
          const pathParts = item.path!.split('/');
          const name = pathParts[pathParts.length - 1];
          const isFile = item.type === 'blob';
          
          map.set(item.path!, {
            name,
            path: item.path!,
            type: isFile ? 'file' : 'dir',
            size: item.size,
            sha: item.sha,
            children: isFile ? undefined : [],
          });
        });

      map.forEach((file, path) => {
        const parentPath = path.split('/').slice(0, -1).join('/');
        const parent = map.get(parentPath);
        
        if (parent && parent.children) {
          parent.children.push(file);
        } else if (parentPath === '') {
          tree.push(file);
        }
      });

      return tree;
    };

    root.children = buildTree(data.tree);
    return root;
  }

  async createCommit(
    owner: string,
    repo: string,
    branch: string,
    message: string,
    changes: { path: string; content: string; mode: 'create' | 'update' | 'delete'; sha?: string }[]
  ): Promise<string> {
    if (!this.octokit) throw new Error('Não autenticado');

    // Get current branch reference
    const { data: branchData } = await this.octokit.git.getRef({
      owner,
      repo,
      ref: `heads/${branch}`,
    });

    // Get current commit
    const { data: currentCommit } = await this.octokit.git.getCommit({
      owner,
      repo,
      commit_sha: branchData.object.sha,
    });

    // Create blobs for each change
    const treeItems = await Promise.all(
      changes.map(async (change) => {
        if (change.mode === 'delete') {
          return {
            path: change.path,
            mode: '100644' as const,
            type: 'blob' as const,
            sha: null,
          };
        }

        const { data: blob } = await this.octokit.git.createBlob({
          owner,
          repo,
          content: change.content,
          encoding: 'utf-8',
        });

        return {
          path: change.path,
          mode: '100644' as const,
          type: 'blob' as const,
          sha: blob.sha,
        };
      })
    );

    // Create new tree
    const { data: newTree } = await this.octokit.git.createTree({
      owner,
      repo,
      base_tree: currentCommit.tree.sha,
      tree: treeItems,
    });

    // Create commit
    const { data: newCommit } = await this.octokit.git.createCommit({
      owner,
      repo,
      message,
      tree: newTree.sha,
      parents: [currentCommit.sha],
    });

    // Update branch reference
    await this.octokit.git.updateRef({
      owner,
      repo,
      ref: `heads/${branch}`,
      sha: newCommit.sha,
    });

    return newCommit.sha;
  }

  async listCommits(
    owner: string,
    repo: string,
    branch: string
  ): Promise<GithubCommit[]> {
    if (!this.octokit) throw new Error('Não autenticado');
    
    const { data } = await this.octokit.repos.listCommits({
      owner,
      repo,
      sha: branch,
      per_page: 50,
    });

    return data.map(commit => ({
      sha: commit.sha,
      message: commit.commit.message,
      author: {
        name: commit.commit.author?.name || 'Unknown',
        date: commit.commit.author?.date || new Date().toISOString(),
      },
    }));
  }
}

export const githubService = new GithubService();
