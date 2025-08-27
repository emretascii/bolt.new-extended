import { useState, useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { detectLocalModels } from '~/lib/.server/llm/providers/local';

interface LocalModelStatusProps {
  className?: string;
}

export const LocalModelStatus = ({ className }: LocalModelStatusProps) => {
  const [localProviders] = useLocalStorage('local-providers', {});
  const [connectionStatus, setConnectionStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const checkConnections = async () => {
      const status: Record<string, boolean> = {};
      
      for (const [providerName, config] of Object.entries(localProviders)) {
        if (config.enabled && config.baseURL) {
          try {
            const models = await detectLocalModels(config.baseURL);
            status[providerName] = models.length > 0;
          } catch {
            status[providerName] = false;
          }
        }
      }
      
      setConnectionStatus(status);
    };

    checkConnections();
    const interval = setInterval(checkConnections, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [localProviders]);

  const connectedProviders = Object.entries(connectionStatus).filter(([_, connected]) => connected);

  if (connectedProviders.length === 0) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 text-xs text-bolt-elements-textSecondary ${className}`}>
      <div className="i-ph:desktop text-green-500" />
      <span>{connectedProviders.length} local provider{connectedProviders.length > 1 ? 's' : ''} connected</span>
    </div>
  );
};