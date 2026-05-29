import { useState, useCallback } from 'react';
import { chat, streamChat, isAIConfigured } from '../services/ai';
import { SYSTEM_PROMPT } from '../data/aiPrompts';

const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [streamingText, setStreamingText] = useState('');

  /**
   * 普通对话
   */
  const sendMessage = useCallback(async (userMessage, context = '') => {
    if (!isAIConfigured()) {
      throw new Error('请先在设置中配置 AI API Key');
    }

    setLoading(true);
    setError(null);

    try {
      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
      ];

      if (context) {
        messages.push({ role: 'system', content: `当前上下文：${context}` });
      }

      messages.push({ role: 'user', content: userMessage });

      const reply = await chat(messages);
      return reply;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 流式对话
   */
  const sendStreamingMessage = useCallback(async (userMessage, context = '', onChunk) => {
    if (!isAIConfigured()) {
      throw new Error('请先在设置中配置 AI API Key');
    }

    setLoading(true);
    setError(null);
    setStreamingText('');

    try {
      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
      ];

      if (context) {
        messages.push({ role: 'system', content: `当前上下文：${context}` });
      }

      messages.push({ role: 'user', content: userMessage });

      const fullText = await streamChat(messages, (chunk) => {
        setStreamingText(prev => prev + chunk);
        onChunk?.(chunk);
      });

      return fullText;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 使用模板 prompt 生成内容
   */
  const generateWithTemplate = useCallback(async (template, variables = {}) => {
    if (!isAIConfigured()) {
      throw new Error('请先在设置中配置 AI API Key');
    }

    setLoading(true);
    setError(null);

    try {
      // 替换模板变量
      let prompt = template;
      for (const [key, value] of Object.entries(variables)) {
        prompt = prompt.replace(`{${key}}`, typeof value === 'string' ? value : JSON.stringify(value));
      }

      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ];

      const reply = await chat(messages);
      return reply;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 使用模板 prompt 流式生成
   */
  const generateStreamingWithTemplate = useCallback(async (template, variables = {}, onChunk) => {
    if (!isAIConfigured()) {
      throw new Error('请先在设置中配置 AI API Key');
    }

    setLoading(true);
    setError(null);
    setStreamingText('');

    try {
      let prompt = template;
      for (const [key, value] of Object.entries(variables)) {
        prompt = prompt.replace(`{${key}}`, typeof value === 'string' ? value : JSON.stringify(value));
      }

      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ];

      const fullText = await streamChat(messages, (chunk) => {
        setStreamingText(prev => prev + chunk);
        onChunk?.(chunk);
      });

      return fullText;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 清除状态
   */
  const clearState = useCallback(() => {
    setError(null);
    setStreamingText('');
  }, []);

  return {
    loading,
    error,
    streamingText,
    sendMessage,
    sendStreamingMessage,
    generateWithTemplate,
    generateStreamingWithTemplate,
    clearState,
    isConfigured: isAIConfigured(),
  };
};

export default useAI;
