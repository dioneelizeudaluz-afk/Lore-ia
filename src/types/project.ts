export interface ProjectInfo {
  name: string;
  framework: 'react' | 'vue' | 'angular' | 'next' | 'vite' | 'unknown';
  language: 'typescript' | 'javascript' | 'html' | 'unknown';
  buildTool: 'vite' | 'webpack' | 'next' | 'unknown';
  dependencies: Record<string, string>;
  structure: ProjectStructure;
  components: ProjectComponent[];
  pages: ProjectPage[];
  routes: ProjectRoute[];
}

export interface ProjectStructure {
  root: string;
  directories: string[];
  files: ProjectFile[];
}

export interface ProjectFile {
  path: string;
  name: string;
  extension: string;
  size: number;
  imports?: string[];
  exports?: string[];
}

export interface ProjectComponent {
  name: string;
  path: string;
  type: 'component' | 'hook' | 'service' | 'util';
  dependencies?: string[];
}

export interface ProjectPage {
  name: string;
  path: string;
  route?: string;
}

export interface ProjectRoute {
  path: string;
  component: string;
  }
