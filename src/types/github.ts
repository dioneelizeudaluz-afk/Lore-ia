export interface GithubUser {
  login: string;
  id: number;
  avatarUrl: string;
  name: string;
  email: string;
}

export interface GithubRepo {
  id: number;
  name: string;
  fullName: string;
  description: string;
  private: boolean;
  defaultBranch: string;
  updatedAt: string;
  language: string;
  htmlUrl: string;
}

export interface GithubBranch {
  name: string;
  commit: {
    sha: string;
  };
}

export interface GithubFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  size?: number;
  content?: string;
  sha?: string;
  children?: GithubFile[];
}

export interface GithubCommit {
  sha: string;
  message: string;
  author: {
    name: string;
    date: string;
  };
  files?: {
    filename: string;
    status: 'added' | 'modified' | 'removed';
    additions: number;
    deletions: number;
  }[];
}
