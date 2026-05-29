/**
 * AI 服务层 - 兼容 OpenAI 格式的第三方 API
 * 支持 DeepSeek、通义千问等
 */

import { loadData } from '../utils/storage';

// 默认配置
const DEFAULT_CONFIG = {
  baseUrl: 'https://api.deepseek.com/v1',
  model: 'deepseek-chat',
  temperature: 0.7,
  maxTokens: 2000,
};

/**
 * 获取 AI 配置
 */
function getAIConfig() {
  const saved = loadData('ai-config', {});
  return { ...DEFAULT_CONFIG, ...saved };
}

/**
 * 构建请求 headers
 */
function buildHeaders(config) {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${config.apiKey}`,
  };
}

/**
 * 发送普通聊天请求（非流式）
 * @param {Array} messages - [{role: 'system'|'user'|'assistant', content: '...'}]
 * @param {Object} options - 覆盖默认配置
 * @returns {Promise<string>} - AI 回复文本
 */
export async function chat(messages, options = {}) {
  const config = { ...getAIConfig(), ...options };

  if (!config.apiKey) {
    throw new Error('请先配置 AI API Key');
  }

  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: buildHeaders(config),
    body: JSON.stringify({
      model: config.model,
      messages,
      temperature: config.temperature,
      max_tokens: config.maxTokens,
      stream: false,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `API 请求失败 (${response.status})`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

/**
 * 发送流式聊天请求（SSE）
 * @param {Array} messages - 消息数组
 * @param {Function} onChunk - 每次收到文本片段时回调 (text: string) => void
 * @param {Object} options - 覆盖默认配置
 * @returns {Promise<string>} - 完整回复文本
 */
export async function streamChat(messages, onChunk, options = {}) {
  const config = { ...getAIConfig(), ...options };

  if (!config.apiKey) {
    throw new Error('请先配置 AI API Key');
  }

  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: buildHeaders(config),
    body: JSON.stringify({
      model: config.model,
      messages,
      temperature: config.temperature,
      max_tokens: config.maxTokens,
      stream: true,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `API 请求失败 (${response.status})`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data: ')) continue;

      const dataStr = trimmed.slice(6);
      if (dataStr === '[DONE]') continue;

      try {
        const data = JSON.parse(dataStr);
        const delta = data.choices?.[0]?.delta?.content;
        if (delta) {
          fullText += delta;
          onChunk?.(delta);
        }
      } catch {
        // 忽略解析错误
      }
    }
  }

  return fullText;
}

/**
 * 测试 API 连接
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function testConnection() {
  try {
    const reply = await chat([
      { role: 'user', content: '你好，请回复"连接成功"四个字。' }
    ], { maxTokens: 50 });
    return { success: true, message: `连接成功！模型回复: ${reply.slice(0, 50)}` };
  } catch (err) {
    return { success: false, message: `连接失败: ${err.message}` };
  }
}

/**
 * 检查 AI 是否已配置
 */
export function isAIConfigured() {
  const config = getAIConfig();
  return !!config.apiKey;
}
