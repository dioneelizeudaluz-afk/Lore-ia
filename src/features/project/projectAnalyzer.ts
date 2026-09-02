import { ProjectInfo, ProjectFile, ProjectComponent, ProjectPage } from '@/types/project';
import { GithubFile } from '@/types/github';

export class ProjectAnalyzer {
  analyzeProject(fileTree: GithubFile, repoName: string): ProjectInfo {
    const structure = this.analyzeStructure(fileTree);
    const framework = this.detectFramework(structure);
    const language = this.detectLanguage(structure);
    const buildTool = this.detectBuildTool(structure);
    const dependencies = this.extractDependencies(structure);
    const components = this.findComponents(structure);
    const pages = this.findPages(structure);
    const routes = this.findRoutes(structure);

    return {
      name: repoName,
      framework,
      language,
      buildTool,
      dependencies,
      structure,
      components,
      pages,
      routes,
    };
  }

  private analyzeStructure(fileTree: GithubFile): any {
    const directories: string[] = [];
    const files: ProjectFile[] = [];

    const traverse = (node: GithubFile, currentPath: string = '') => {
      if (node.type === 'dir') {
        const path = currentPath ? `${currentPath}/${node.name}` : node.name;
        directories.push(path);
        node.children?.forEach(child => traverse(child, path));
      } else {
        const path = currentPath ? `${currentPath}/${node.name}` : node.name;
        files.push({
          path,
          name: node.name,
          extension: this.getFileExtension(node.name),
          size: node.size || 0,
          imports: [],
          exports: [],
        });
      }
    };

    traverse(fileTree);
    return { root: fileTree.name, directories, files };
  }

  private detectFramework(structure: any): ProjectInfo['framework'] {
    const files = structure.files;
    
    if (files.some((f: ProjectFile) => f.path.includes('next.config'))) {
      return 'next';
    }
    if (files.some((f: ProjectFile) => f.path.includes('vite.config'))) {
      return 'vite';
    }
    if (files.some((f: ProjectFile) => f.path.includes('angular.json'))) {
      return 'angular';
    }
    if (files.some((f: ProjectFile) => f.path.includes('vue.config'))) {
      return 'vue';
    }
    if (files.some((f: ProjectFile) => f.extension === 'tsx' || f.extension === 'jsx')) {
      return 'react';
    }
    return 'unknown';
  }

  private detectLanguage(structure: any): ProjectInfo['language'] {
    const files = structure.files;
    
    if (files.some((f: ProjectFile) => f.extension === 'ts' || f.extension === 'tsx')) {
      return 'typescript';
    }
    if (files.some((f: ProjectFile) => f.extension === 'js' || f.extension === 'jsx')) {
      return 'javascript';
    }
    if (files.some((f: ProjectFile) => f.extension === 'html')) {
      return 'html';
    }
    return 'unknown';
  }

  private detectBuildTool(structure: any): ProjectInfo['buildTool'] {
    const files = structure.files;
    
    if (files.some((f: ProjectFile) => f.path.includes('vite.config'))) {
      return 'vite';
    }
    if (files.some((f: ProjectFile) => f.path.includes('webpack.config'))) {
      return 'webpack';
    }
    if (files.some((f: ProjectFile) => f.path.includes('next.config'))) {
      return 'next';
    }
    return 'unknown';
  }

  private extractDependencies(structure: any): Record<string, string> {
    const packageJson = structure.files.find((f: ProjectFile) => f.name === 'package.json');
    if (!packageJson?.content) return {};
    
    try {
      const parsed = JSON.parse(packageJson.content);
      return {
        ...parsed.dependencies,
        ...parsed.devDependencies,
      };
    } catch {
      return {};
    }
  }

  private findComponents(structure: any): ProjectComponent[] {
    const components: ProjectComponent[] = [];
    const componentFiles = structure.files.filter((f: ProjectFile) => 
      f.path.includes('/components/') || f.path.includes('/src/components/')
    );

    componentFiles.forEach((file: ProjectFile) => {
      const name = file.name.replace(/\.(tsx|jsx|ts|js)$/, '');
      const type = this.detectComponentType(file.path);
      
      components.push({
        name,
        path: file.path,
        type,
        dependencies: [],
      });
    });

    return components;
  }

  private findPages(structure: any): ProjectPage[] {
    const pages: ProjectPage[] = [];
    const pageFiles = structure.files.filter((f: ProjectFile) => 
      f.path.includes('/pages/') || f.path.includes('/src/pages/')
    );

    pageFiles.forEach((file: ProjectFile) => {
      const name = file.name.replace(/\.(tsx|jsx|ts|js)$/, '');
      const route = this.inferRoute(file.path);
      
      pages.push({
        name,
        path: file.path,
        route,
      });
    });

    return pages;
  }

  private findRoutes(structure: any): any[] {
    const routes: any[] = [];
    const routeFiles = structure.files.filter((f: ProjectFile) => 
      f.path.includes('routes') || f.path.includes('router') || f.path.includes('App.tsx')
    );

    routeFiles.forEach((file: ProjectFile) => {
      // Basic route detection - can be enhanced later
      if (file.content) {
        const routeMatches = file.content.match(/<Route[^>]*path=["']([^"']+)["']/g);
        routeMatches?.forEach(match => {
          const path = match.match(/path=["']([^"']+)["']/)?.[1];
          if (path) {
            routes.push({
              path,
              component: file.path,
            });
          }
        });
      }
    });

    return routes;
  }

  private detectComponentType(path: string): ProjectComponent['type'] {
    if (path.includes('/hooks/') || path.startsWith('use')) return 'hook';
    if (path.includes('/services/')) return 'service';
    if (path.includes('/utils/')) return 'util';
    return 'component';
  }

  private inferRoute(path: string): string | undefined {
    const match = path.match(/pages\/(.+?)\.(tsx|jsx|ts|js)$/);
    if (match) {
      const route = match[1].replace(/\[(.+?)\]/g, ':$1');
      return route === 'index' ? '/' : `/${route}`;
    }
    return undefined;
  }

  private getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }
}

export const projectAnalyzer = new ProjectAnalyzer();
