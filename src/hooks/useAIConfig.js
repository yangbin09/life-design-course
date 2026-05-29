import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { testConnection } from '../services/ai';

const defaultConfig = {
  apiKey: '',
  baseUrl: 'https://api.deepseek.com/v1',
  model: 'deepseek-chat',
  temperature: 0.7,
  maxTokens: 2000,
};

const useAIConfig = () => {
  const [config, setConfig] = useLocalStorage('ai-config', defaultConfig);
  const [testStatus, setTestStatus] = useState(null); // { success, message }
  const [testing, setTesting] = useState(false);

  const updateConfig = useCallback((updates) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, [setConfig]);

  const resetConfig = useCallback(() => {
    setConfig(defaultConfig);
    setTestStatus(null);
  }, [setConfig]);

  const handleTestConnection = useCallback(async () => {
    setTesting(true);
    setTestStatus(null);
    try {
      const result = await testConnection();
      setTestStatus(result);
    } catch (err) {
      setTestStatus({ success: false, message: err.message });
    } finally {
      setTesting(false);
    }
  }, []);

  const isConfigured = !!config.apiKey;

  return {
    config,
    updateConfig,
    resetConfig,
    testConnection: handleTestConnection,
    testStatus,
    testing,
    isConfigured,
  };
};

export default useAIConfig;
