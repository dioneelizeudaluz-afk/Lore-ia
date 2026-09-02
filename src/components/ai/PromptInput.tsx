import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Mic, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MAX_PROMPT_LENGTH } from '@/lib/constants';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  loading?: boolean;
  disabled?: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({
  onSubmit,
  loading = false,
  disabled = false,
}) => {
  const [prompt, setPrompt] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  const handleSubmit = () => {
    if (!prompt.trim() || loading || disabled) return;
    onSubmit(prompt.trim());
    setPrompt('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-white/10 bg-lore-dark p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value.slice(0, MAX_PROMPT_LENGTH))}
              onKeyDown={handleKeyDown}
              placeholder="Descreva o que você quer alterar no projeto..."
              disabled={disabled}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 pr-24 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lore-purple/50 resize-none min-h-[60px] max-h-[200px] transition-all duration-200"
              rows={1}
            />
            <div className="absolute bottom-3 right-3 flex items-center space-x-2">
              <button
                className="text-gray-400 hover:text-white transition-colors"
                title="Anexar arquivo"
                disabled={disabled}
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <button
                className="text-gray-400 hover:text-white transition-colors"
                title="Usar voz"
                disabled={disabled}
              >
                <Mic className="w-5 h-5" />
              </button>
            </div>
          </div>
          <Button
            onClick={handleSubmit}
            loading={loading}
            disabled={disabled || !prompt.trim()}
            icon={Sparkles}
            className="h-[60px] px-6"
            aria-label="Enviar prompt"
          >
            Enviar
          </Button>
        </div>
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-500">
            {prompt.length}/{MAX_PROMPT_LENGTH} caracteres
          </p>
          <div className="flex space-x-1">
            <button className="text-xs text-gray-500 hover:text-lore-purple transition-colors px-2 py-1">
              Exemplos
            </button>
            <button className="text-xs text-gray-500 hover:text-lore-purple transition-colors px-2 py-1">
              Limpar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
