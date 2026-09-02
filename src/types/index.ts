export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginationParams {
  page: number;
  perPage: number;
  total?: number;
}

export interface FileChange {
  path: string;
  content: string;
  originalContent?: string;
  status: 'added' | 'modified' | 'deleted';
}
