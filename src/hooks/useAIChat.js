import { useState, useCallback, useEffect } from 'react';
import { chat, streamChat, isAIConfigured } from '../services/ai';
import { SYSTEM_PROMPT } from '../data/aiPrompts';
import { useAIContext } from '../contexts/AIContext';
import { loadData, saveData } from '../utils/storage';

const MAX_HISTORY = 50; // 最大保存对话轮数
const STORAGE_KEY = 'ai-chat-history';

/**
 * AI 对话 hook - 支持持久化和上下文注入
 */
const useAIChat = () => {
  const { getSystemPromptWithContext, buildUserSummary } = useAIContext();

  // 从 localStorage 加载历史
  const [messages, setMessages] = useState(() => {
    const saved = loadData(STORAGE_KEY, []);
    return saved;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [streamingText, setStreamingText] = useState('');

  // 消息变化时自动保存
  useEffect(() => {
    if (messages.length > 0) {
      saveData(STORAGE_KEY, messages);
    }
  }, [messages]);

  /**
   * 发送消息（流式）
   */
  const sendMessage = useCallback(async (userContent) => {
    if (!isAIConfigured()) {
      throw new Error('请先在设置中配置 AI API Key');
    }

    const userMsg = { role: 'user', content: userContent, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);

    setLoading(true);
    setError(null);
    setStreamingText('');

    try {
      // 构建消息历史（最近 N 条 + system prompt）
      const recentMessages = [...messages, userMsg].slice(-20);
      const apiMessages = [
        { role: 'system', content: getSystemPromptWithContext(SYSTEM_PROMPT) },
        ...recentMessages.map(m => ({ role: m.role, content: m.content })),
      ];

      const aiMsg = { role: 'assistant', content: '', timestamp: Date.now() };
      setMessages(prev => [...prev, aiMsg]);

      const fullText = await streamChat(apiMessages, (chunk) => {
        setStreamingText(prev => prev + chunk);
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: (updated[updated.length - 1]?.content || '') + chunk,
          };
          return updated;
        });
      });

      // 确保最终文本完整
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { ...updated[updated.length - 1], content: fullText };
        return updated;
      });

      // 超过上限时截断
      setMessages(prev => {
        if (prev.length > MAX_HISTORY) {
          return prev.slice(prev.length - MAX_HISTORY);
        }
        return prev;
      });

      return fullText;
    } catch (err) {
      setError(err.message);
      // 移除失败的 AI 消息
      setMessages(prev => prev.filter((_, i) => i < prev.length - 1 || prev[i].content));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [messages, getSystemPromptWithContext]);

  /**
   * 发送消息（非流式）
   */
  const sendMessageSync = useCallback(async (userContent) => {
    if (!isAIConfigured()) {
      throw new Error('请先在设置中配置 AI API Key');
    }

    const userMsg = { role: 'user', content: userContent, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);

    setLoading(true);
    setError(null);

    try {
      const recentMessages = [...messages, userMsg].slice(-20);
      const apiMessages = [
        { role: 'system', content: getSystemPromptWithContext(SYSTEM_PROMPT) },
        ...recentMessages.map(m => ({ role: m.role, content: m.content })),
      ];

      const reply = await chat(apiMessages);
      const aiMsg = { role: 'assistant', content: reply, timestamp: Date.now() };
      setMessages(prev => [...prev, aiMsg]);

      return reply;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [messages, getSystemPromptWithContext]);

  /**
   * 清空对话历史
   */
  const clearHistory = useCallback(() => {
    setMessages([]);
    setStreamingText('');
    setError(null);
    saveData(STORAGE_KEY, []);
  }, []);

  /**
   * 删除单条消息
   */
  const deleteMessage = useCallback((index) => {
    setMessages(prev => prev.filter((_, i) => i !== index));
  }, []);

  return {
    messages,
    loading,
    error,
    streamingText,
    sendMessage,
    sendMessageSync,
    clearHistory,
    deleteMessage,
    isConfigured: isAIConfigured(),
    userSummary: buildUserSummary,
  };
};

export default useAIChat;
