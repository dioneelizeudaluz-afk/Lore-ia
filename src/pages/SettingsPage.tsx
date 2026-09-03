import React, { useState, useEffect } from 'react';
import { Key, Sparkles, Save, Check, Cpu, GitBranch } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [geminiKey, setGeminiKey] = useState('');
  const [hy3Key, setHy3Key] = useState('');
  const [aiProvider, setAiProvider] = useState('gemini');
  const [aiModel, setAiModel] = useState('gemini-3.6-flash');
  const [autoRouting, setAutoRouting] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedGemini = localStorage.getItem('gemini_api_key');
    const savedHy3 = localStorage.getItem('hy3_api_key');
    const savedProvider = localStorage.getItem('ai_provider');
    const savedModel = localStorage.getItem('ai_model');
    const savedRouting = localStorage.getItem('auto_routing');

    if (savedGemini) setGeminiKey(savedGemini);
    if (savedHy3) setHy3Key(savedHy3);
    if (savedProvider) setAiProvider(savedProvider);
    if (savedModel) setAiModel(savedModel);
    if (savedRouting) setAutoRouting(savedRouting === 'true');
  }, []);

  const handleSave = () => {
    localStorage.setItem('gemini_api_key', geminiKey);
    localStorage.setItem('hy3_api_key', hy3Key);
    localStorage.setItem('ai_provider', aiProvider);
    localStorage.setItem('ai_model', aiModel);
    localStorage.setItem('auto_routing', String(autoRouting));
    
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: 'white', fontSize: '26px', marginBottom: '20px' }}>
        Configurações
      </h1>

      {/* Modelos de IA */}
      <div style={{ background: '#131320', border: '1px solid #2a2a3e', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
        <h2 style={{ color: '#8b5cf6', fontSize: '18px', marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
          <Cpu size={20} style={{ marginRight: '10px' }} />
          Modelos de IA
        </h2>

        {/* Gemini Status */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px',
          background: '#1a1a2e',
          borderRadius: '8px',
          marginBottom: '10px',
        }}>
          <div>
            <p style={{ color: 'white', fontSize: '14px', fontWeight: 'bold', margin: 0 }}>Gemini</p>
            <p style={{ color: '#9ca3af', fontSize: '12px', margin: '5px 0 0' }}>Cérebro principal</p>
          </div>
          <span style={{
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 'bold',
            background: '#10b98120',
            color: '#10b981',
          }}>
            ✓ Conectado
          </span>
        </div>

        {/* Hy3 Status */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px',
          background: '#1a1a2e',
          borderRadius: '8px',
          marginBottom: '15px',
        }}>
          <div>
            <p style={{ color: 'white', fontSize: '14px', fontWeight: 'bold', margin: 0 }}>Hy3</p>
            <p style={{ color: '#9ca3af', fontSize: '12px', margin: '5px 0 0' }}>Especialista em programação</p>
          </div>
          <span style={{
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 'bold',
            background: hy3Key ? '#10b98120' : '#6b728020',
            color: hy3Key ? '#10b981' : '#6b7280',
          }}>
            {hy3Key ? '✓ Conectado' : 'Não configurado'}
          </span>
        </div>

        {/* Modelo principal */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ color: '#9ca3af', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
            Modelo principal
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
            <option value="gemini">Gemini</option>
            <option value="hy3">Hy3</option>
          </select>
        </div>

        {/* Roteamento automático */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px',
          background: '#1a1a2e',
          borderRadius: '8px',
        }}>
          <div>
            <p style={{ color: 'white', fontSize: '14px', fontWeight: 'bold', margin: 0 }}>Roteamento automático</p>
            <p style={{ color: '#9ca3af', fontSize: '12px', margin: '5px 0 0' }}>
              Escolhe automaticamente o melhor modelo
            </p>
          </div>
          <button
            onClick={() => setAutoRouting(!autoRouting)}
            style={{
              width: '50px',
              height: '28px',
              borderRadius: '14px',
              background: autoRouting ? '#8b5cf6' : '#2a2a3e',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.3s',
            }}
          >
            <span style={{
              position: 'absolute',
              top: '3px',
              left: autoRouting ? '25px' : '3px',
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              background: 'white',
              transition: 'all 0.3s',
            }} />
          </button>
        </div>
      </div>

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
            Hy3 API Key
          </label>
          <input
            type="password"
            placeholder="hy3-..."
            value={hy3Key}
            onChange={(e) => setHy3Key(e.target.value)}
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
