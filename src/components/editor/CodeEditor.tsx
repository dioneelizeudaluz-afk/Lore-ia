import React, { useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { Loader2 } from 'lucide-react';
import { MONACO_THEME } from '@/lib/constants';
import { getFileLanguage } from '@/utils/fileParser';

interface CodeEditorProps {
  filename: string;
  content: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  filename,
  content,
  onChange,
  readOnly = false,
}) => {
  const language = getFileLanguage(filename);

  const handleEditorDidMount = useCallback((editor: any) => {
    // Configurações do editor
    editor.updateOptions({
      fontSize: 14,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      wordWrap: 'on',
      lineNumbers: 'on',
      renderWhitespace: 'selection',
      tabSize: 2,
      insertSpaces: true,
    });
  }, []);

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        language={language}
        value={content}
        theme={MONACO_THEME}
        onChange={(value) => onChange?.(value || '')}
        onMount={handleEditorDidMount}
        loading={
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 text-lore-purple animate-spin" />
          </div>
        }
        options={{
          readOnly,
          selectOnLineNumbers: true,
          roundedSelection: false,
          readOnlyMessage: {
            value: 'Editor somente leitura'
          },
          cursorStyle: 'line',
          automaticLayout: true,
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
        }}
      />
    </div>
  );
};
