export interface AIContext {
  projectInfo: ProjectInfo;
  conversation: Message[];
  relevantFiles: RelevantFile[];
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface RelevantFile {
  path: string;
  content: string;
  reason: string;
  dependencies?: string[];
}

export interface AIPlan {
  objective: string;
  filesToModify: FileModification[];
  reasoning: string[];
}

export interface FileModification {
  path: string;
  action: 'create' | 'modify' | 'delete';
  changes: CodeChange[];
  newContent?: string;
}

export interface CodeChange {
  type: 'add' | 'remove' | 'replace';
  lineNumber?: number;
  oldCode?: string;
  newCode?: string;
}

export interface AIResponse {
  plan: AIPlan;
  explanation: string;
  modifications: FileModification[];
  }
