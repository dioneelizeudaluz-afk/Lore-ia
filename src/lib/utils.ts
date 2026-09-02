export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

export function isValidFileName(name: string): boolean {
  return /^[a-zA-Z0-9-_./]+$/.test(name);
}

export function normalizePath(path: string): string {
  return path.replace(/\/+/g, '/').replace(/^\/+|\/+$/g, '');
  }
