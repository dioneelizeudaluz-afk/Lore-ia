export const APP_NAME = 'LORE IA';
export const APP_VERSION = '1.0.0';

export const GITHUB_SCOPES = ['repo', 'read:user', 'user:email'];

export const SUPPORTED_LANGUAGES = [
  'typescript',
  'javascript',
  'tsx',
  'jsx',
  'html',
  'css',
  'json',
  'markdown',
];

export const MONACO_THEME = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '6b7280', fontStyle: 'italic' },
    { token: 'keyword', foreground: 'a78bfa' },
    { token: 'string', foreground: '34d399' },
    { token: 'number', foreground: 'f472b6' },
    { token: 'type', foreground: '60a5fa' },
  ],
  colors: {
    'editor.background': '#0a0a0f',
    'editor.foreground': '#e5e7eb',
    'editor.lineHighlightBackground': '#131320',
    'editorLineNumber.foreground': '#4b5563',
    'editorLineNumber.activeForeground': '#a78bfa',
    'editor.selectionBackground': '#7c3aed40',
    'editor.inactiveSelectionBackground': '#7c3aed20',
  },
};

export const MAX_PROMPT_LENGTH = 4000;
export const MAX_FILES_PER_REQUEST = 10;
export const DEBOUNCE_DELAY = 500;
