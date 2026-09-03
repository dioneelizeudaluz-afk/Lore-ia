import React, { useState, useEffect } from 'react';
import { Key, Sparkles, Save, Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [geminiKey, setGeminiKey] = useState('');
  const [claudeKey, setClaudeKey] = useState('');
  const [deepseekKey, setDeepseekKey] = useState('');
  const [aiProvider, setAiProvider] = useState('gemini');
  const [aiModel, setAiModel] = useState('gemini-pro');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedGemini = localStorage.getItem('gemini_api_key');
    const savedClaude = localStorage.getItem('claude_api_key');
    const savedDeepseek = localStorage.getItem('deepseek_api_key');
    const savedProvider = localStorage.getItem('ai_provider');
    const savedModel = localStorage.getItem('ai_model');

    if (savedGemini) setGeminiKey(savedGemini);
    if (savedClaude) setClaudeKey(savedClaude);
    if (savedDeepseek) setDeepseekKey(savedDeepseek);
    if (savedProvider) setAiProvider(savedProvider);
    if (savedModel) setAiModel(savedModel);
  }, []);

  const handleSave = () => {
    localStorage.setItem('gemini_api_key', geminiKey);
    localStorage.setItem('claude_api_key', claudeKey);
    localStorage.setItem('deepseek_api_key', deepseekKey);
    localStorage.setItem('ai_provider', aiProvider);
    localStorage.setItem('ai_model', aiModel);
    
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: 'white', fontSize: '26px', marginBottom: '20px' }}>
        Configurações
      </h1>

      {/* API Keys */}
      <div style={{ background: '#131320', border: '1px solid #2a2a3e', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
        <h2 style={{ color: '#8b5cf6', fontSize: '18px', marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
          <Key size={20} style={{ marginRight: '10px' }} />
          API Keys
        </h2>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ color: '#9ca3af', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
            Google Gemini API Key
          </label>
          <input
            type="password"
            placeholder="AIza..."
            value={geminiKey}
            onChange={(e) => setGeminiKey(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              background: '#1a1a2e',
              border: '1px solid #2a2a3e',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ color: '#9ca3af', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
            Anthropic Claude API Key
          </label>
          <input
            type="password"
            placeholder="sk-ant-..."
            value={claudeKey}
            onChange={(e) => setClaudeKey(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              background: '#1a1a2e',
              border: '1px solid #2a2a3e',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ color: '#9ca3af', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
            DeepSeek API Key
          </label>
          <input
            type="password"
            placeholder="sk-..."
            value={deepseekKey}
            onChange={(e) => setDeepseekKey(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              background: '#1a1a2e',
              border: '1px solid #2a2a3e',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* AI Engine */}
      <div style={{ background: '#131320', border: '1px solid #2a2a3e', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
        <h2 style={{ color: '#8b5cf6', fontSize: '18px', marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
          <Sparkles size={20} style={{ marginRight: '10px' }} />
          IA Engine
        </h2>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ color: '#9ca3af', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
            Provider Padrão
          </label>
          <select
            value={aiProvider}
            onChange={(e) => setAiProvider(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              background: '#1a1a2e',
              border: '1px solid #2a2a3e',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          >
            <option value="gemini">Google Gemini</option>
            <option value="claude">Anthropic Claude</option>
            <option value="deepseek">DeepSeek</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ color: '#9ca3af', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
            Modelo
          </label>
          <select
            value={aiModel}
            onChange={(e) => setAiModel(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              background: '#1a1a2e',
              border: '1px solid #2a2a3e',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          >
            {aiProvider === 'gemini' && (
              <>
                <option value="gemini-pro">Gemini Pro</option>
                <option value="gemini-ultra">Gemini Ultra</option>
              </>
            )}
            {aiProvider === 'claude' && (
              <>
                <option value="claude-3-opus">Claude 3 Opus</option>
                <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                <option value="claude-2">Claude 2</option>
              </>
            )}
            {aiProvider === 'deepseek' && (
              <>
                <option value="deepseek-chat">DeepSeek Chat</option>
                <option value="deepseek-coder">DeepSeek Coder</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        style={{
          width: '100%',
          padding: '15px',
          background: saved ? '#10b981' : 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
          border: 'none',
          borderRadius: '8px',
          color: 'white',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
        }}
      >
        {saved ? <Check size={20} /> : <Save size={20} />}
        {saved ? 'Salvo!' : 'Salvar Configurações'}
      </button>
    </div>
  );
};
