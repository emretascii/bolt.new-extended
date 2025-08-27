import { useState, useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { IconButton } from '~/components/ui/IconButton';
import { detectLocalModels, LOCAL_PROVIDERS, type LocalProvider } from '~/lib/.server/llm/providers/local';

interface LocalProviderConfig {
  enabled: boolean;
  baseURL: string;
  apiKey?: string;
  models: string[];
}

export const LocalProviders = () => {
  const [localProviders, setLocalProviders] = useLocalStorage<Record<string, LocalProviderConfig>>(
    'local-providers',
    {}
  );
  
  const [testingConnection, setTestingConnection] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<Record<string, 'success' | 'error' | null>>({});

  const updateProvider = (providerName: string, config: Partial<LocalProviderConfig>) => {
    setLocalProviders(prev => ({
      ...prev,
      [providerName]: {
        ...prev[providerName],
        ...config
      }
    }));
  };

  const testConnection = async (provider: LocalProvider) => {
    setTestingConnection(provider.name);
    setConnectionStatus(prev => ({ ...prev, [provider.name]: null }));

    try {
      const config = localProviders[provider.name];
      const baseURL = config?.baseURL || provider.baseURL;
      
      const models = await detectLocalModels(baseURL);
      
      if (models.length > 0) {
        updateProvider(provider.name, { 
          enabled: true, 
          baseURL, 
          models 
        });
        setConnectionStatus(prev => ({ ...prev, [provider.name]: 'success' }));
      } else {
        setConnectionStatus(prev => ({ ...prev, [provider.name]: 'error' }));
      }
    } catch (error) {
      setConnectionStatus(prev => ({ ...prev, [provider.name]: 'error' }));
    } finally {
      setTestingConnection(null);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-bolt-elements-textPrimary">Local AI Providers</h3>
        <span className="text-sm text-bolt-elements-textSecondary">
          Configure local AI model providers running on your machine
        </span>
      </div>

      <div className="space-y-4">
        {LOCAL_PROVIDERS.map((provider) => {
          const config = localProviders[provider.name];
          const status = connectionStatus[provider.name];
          const isTesting = testingConnection === provider.name;

          return (
            <div
              key={provider.name}
              className="p-4 rounded-lg border border-bolt-elements-borderColor bg-bolt-elements-background-depth-1"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h4 className="font-medium text-bolt-elements-textPrimary">{provider.name}</h4>
                  {status === 'success' && (
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <div className="i-ph:check-circle-fill" />
                      Connected
                    </div>
                  )}
                  {status === 'error' && (
                    <div className="flex items-center gap-1 text-xs text-red-600">
                      <div className="i-ph:x-circle-fill" />
                      Connection failed
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config?.enabled || false}
                      onChange={(e) => updateProvider(provider.name, { enabled: e.target.checked })}
                      className="accent-bolt-elements-accentPrimary"
                    />
                    <span className="text-sm text-bolt-elements-textSecondary">Enable</span>
                  </label>
                  <IconButton
                    icon={isTesting ? "i-svg-spinners:90-ring-with-bg" : "i-ph:plug"}
                    size="sm"
                    title="Test Connection"
                    disabled={isTesting}
                    onClick={() => testConnection(provider)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-bolt-elements-textPrimary mb-1">
                    Base URL
                  </label>
                  <input
                    type="text"
                    value={config?.baseURL || provider.baseURL}
                    onChange={(e) => updateProvider(provider.name, { baseURL: e.target.value })}
                    placeholder={provider.baseURL}
                    className="w-full px-3 py-2 rounded-md border border-bolt-elements-borderColor bg-bolt-elements-background-depth-2 text-bolt-elements-textPrimary"
                  />
                </div>

                {provider.name !== 'Ollama' && (
                  <div>
                    <label className="block text-sm font-medium text-bolt-elements-textPrimary mb-1">
                      API Key (Optional)
                    </label>
                    <input
                      type="password"
                      value={config?.apiKey || ''}
                      onChange={(e) => updateProvider(provider.name, { apiKey: e.target.value })}
                      placeholder="Enter API key if required"
                      className="w-full px-3 py-2 rounded-md border border-bolt-elements-borderColor bg-bolt-elements-background-depth-2 text-bolt-elements-textPrimary"
                    />
                  </div>
                )}

                {config?.models && config.models.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-bolt-elements-textPrimary mb-1">
                      Available Models ({config.models.length})
                    </label>
                    <div className="max-h-32 overflow-y-auto bg-bolt-elements-background-depth-2 rounded-md p-2">
                      {config.models.map((model, index) => (
                        <div key={index} className="text-xs text-bolt-elements-textSecondary py-1">
                          {model}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 rounded-lg bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor">
        <h4 className="font-medium text-bolt-elements-textPrimary mb-2">Setup Instructions</h4>
        <div className="space-y-2 text-sm text-bolt-elements-textSecondary">
          <p><strong>Ollama:</strong> Install from <a href="https://ollama.ai" target=\"_blank" className="text-bolt-elements-textPrimary underline">ollama.ai</a> and run <code className="bg-bolt-elements-code-background px-1 rounded">ollama serve</code></p>
          <p><strong>LM Studio:</strong> Download from <a href="https://lmstudio.ai" target=\"_blank" className="text-bolt-elements-textPrimary underline">lmstudio.ai</a> and start the local server</p>
          <p><strong>LocalAI:</strong> Follow setup instructions at <a href="https://localai.io" target=\"_blank" className="text-bolt-elements-textPrimary underline">localai.io</a></p>
        </div>
      </div>
    </div>
  );
};