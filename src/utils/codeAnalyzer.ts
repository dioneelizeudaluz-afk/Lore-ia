import { ProjectFile } from '@/types/project';

export function extractImports(content: string): string[] {
  const imports: string[] = [];
  const importRegex = /import\s+(?:[\w\s{},*]+\s+from\s+)?['"]([^'"]+)['"]/g;
  
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  
  return imports;
}

export function extractExports(content: string): string[] {
  const exports: string[] = [];
  const exportRegex = /export\s+(?:default\s+)?(?:const|let|var|function|class|interface|type)?\s*(\w+)?/g;
  
  let match;
  while ((match = exportRegex.exec(content)) !== null) {
    if (match[1]) {
      exports.push(match[1]);
    }
  }
  
  return exports;
}

export function findComponentDependencies(
  file: ProjectFile,
  allFiles: ProjectFile[]
): string[] {
  if (!file.imports) return [];
  
  const dependencies: string[] = [];
  
  file.imports.forEach(importPath => {
    const resolvedPath = resolveImportPath(file.path, importPath);
    const dependency = allFiles.find(f => f.path === resolvedPath);
    
    if (dependency) {
      dependencies.push(dependency.path);
    }
  });
  
  return dependencies;
}

function resolveImportPath(currentFile: string, importPath: string): string {
  if (importPath.startsWith('.')) {
    // Relative import
    const currentDir = currentFile.split('/').slice(0, -1).join('/');
    const resolved = normalizePath(`${currentDir}/${importPath}`);
    
    // Try different extensions
    const extensions = ['.ts', '.tsx', '.js', '.jsx', '.json', '.css'];
    
    for (const ext of extensions) {
      if (resolved.endsWith(ext)) {
        return resolved;
      }
    }
    
    // Check if it's a directory import
    for (const ext of extensions) {
      const withExt = `${resolved}${ext}`;
      if (withExt) {
        return withExt;
      }
    }
    
    return resolved;
  }
  
  return importPath;
}

function normalizePath(path: string): string {
  const parts = path.split('/');
  const normalized: string[] = [];
  
  parts.forEach(part => {
    if (part === '..') {
      normalized.pop();
    } else if (part !== '.' && part !== '') {
      normalized.push(part);
    }
  });
  
  return normalized.join('/');
}

export function analyzeCodeComplexity(content: string): {
  lines: number;
  functions: number;
  classes: number;
  comments: number;
} {
  const lines = content.split('\n').length;
  const functions = (content.match(/function\s+\w+|=>\s*{|=>\s*\(/g) || []).length;
  const classes = (content.match(/class\s+\w+/g) || []).length;
  const comments = (content.match(/\/\/.*|\/\*[\s\S]*?\*\//g) || []).length;
  
  return {
    lines,
    functions,
    classes,
    comments,
  };
  }
