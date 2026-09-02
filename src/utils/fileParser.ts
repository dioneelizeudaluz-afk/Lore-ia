import { GithubFile } from '@/types/github';

export function parseFileTree(tree: GithubFile[], prefix: string = ''): string[] {
  const paths: string[] = [];
  
  tree.forEach(node => {
    const fullPath = prefix ? `${prefix}/${node.name}` : node.name;
    
    if (node.type === 'file') {
      paths.push(fullPath);
    } else if (node.children) {
      paths.push(...parseFileTree(node.children, fullPath));
    }
  });
  
  return paths;
}

export function findFileInTree(tree: GithubFile, path: string): GithubFile | null {
  if (tree.path === path) {
    return tree;
  }
  
  if (tree.children) {
    for (const child of tree.children) {
      const found = findFileInTree(child, path);
      if (found) return found;
    }
  }
  
  return null;
}

export function getFileLanguage(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  const languageMap: Record<string, string> = {
    'ts': 'typescript',
    'tsx': 'typescript',
    'js': 'javascript',
    'jsx': 'javascript',
    'html': 'html',
    'css': 'css',
    'json': 'json',
    'md': 'markdown',
    'yml': 'yaml',
    'yaml': 'yaml',
    'xml': 'xml',
    'sql': 'sql',
    'sh': 'shell',
    'bash': 'shell',
  };
  
  return languageMap[extension || ''] || 'plaintext';
}

export function isBinaryFile(filename: string): boolean {
  const binaryExtensions = [
    'png', 'jpg', 'jpeg', 'gif', 'ico', 'svg',
    'pdf', 'zip', 'tar', 'gz', 'rar',
    'woff', 'woff2', 'ttf', 'eot', 'otf',
    'mp3', 'mp4', 'avi', 'mov', 'wav',
  ];
  
  const extension = filename.split('.').pop()?.toLowerCase();
  return binaryExtensions.includes(extension || '');
    }
