import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import useAI from '../../hooks/useAI';
import { useAIContext } from '../../contexts/AIContext';

/**
 * 内嵌式 AI 反馈组件
 * 自动触发，显示在模块内容旁边或下方
 */
const AIInlineFeedback = ({
  prompt,
  trigger = 'manual', // 'manual' | 'auto' | 'debounce'
  debounceMs = 3000,
  context = '',
  compact = false,
  onResult,
  autoTrigger = false,
}) => {
  const { loading, streamingText, generateWithTemplate, generateStreamingWithTemplate, isConfigured } = useAI();
  const { getSystemPromptWithContext } = useAIContext();
  const [result, setResult] = useState('');
  const [show, setShow] = useState(false);
  const debounceTimer = useRef(null);

  // 自动触发
  useEffect(() => {
    if (autoTrigger && prompt && isConfigured) {
      handleGenerate();
    }
  }, [autoTrigger]); // eslint-disable-line

  // Debounce 触发
  useEffect(() => {
    if (trigger === 'debounce' && prompt) {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        if (isConfigured) handleGenerate();
      }, debounceMs);
      return () => clearTimeout(debounceTimer.current);
    }
  }, [prompt, trigger, debounceMs]); // eslint-disable-line

  const handleGenerate = async () => {
    if (!isConfigured || loading) return;
    setShow(true);
    try {
      const fullPrompt = context
        ? `用户数据上下文：${context}\n\n${prompt}`
        : prompt;
      const text = await generateStreamingWithTemplate(fullPrompt);
      setResult(text);
      onResult?.(text);
    } catch (err) {
      setResult(`分析失败: ${err.message}`);
    }
  };

  if (!isConfigured) return null;

  if (compact) {
    return (
      <div className="inline-flex items-center gap-1.5">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full transition-colors cursor-pointer"
          style={{
            background: 'rgba(198,123,92,0.1)',
            color: 'var(--color-primary)',
            border: '1px solid rgba(198,123,92,0.2)',
          }}
        >
          {loading ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
          AI
        </button>
        {show && result && (
          <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
            {result.slice(0, 30)}...
          </span>
        )}
      </div>
    );
  }

  return (
    <div>
      {!show && (
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all cursor-pointer"
          style={{
            background: 'rgba(198,123,92,0.08)',
            color: 'var(--color-primary)',
            border: '1px solid rgba(198,123,92,0.15)',
            fontFamily: 'var(--font-body)',
          }}
        >
          {loading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
          AI 分析
        </button>
      )}

      {show && (
        <div
          className="p-3 rounded-xl text-sm leading-relaxed"
          style={{
            background: 'rgba(198,123,92,0.05)',
            border: '1px solid rgba(198,123,92,0.1)',
            color: 'var(--color-text)',
            fontFamily: 'var(--font-body)',
          }}
        >
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles size={12} style={{ color: 'var(--color-primary)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--color-primary)' }}>
              AI 分析
            </span>
          </div>
          {loading ? (
            <div className="flex items-center gap-2" style={{ color: 'var(--color-text-muted)' }}>
              <Loader2 size={14} className="animate-spin" />
              分析中...
            </div>
          ) : (
            <>
              <div className="whitespace-pre-wrap">{streamingText || result}</div>
              <button
                onClick={() => { setShow(false); setResult(''); }}
                className="mt-2 text-[10px] cursor-pointer"
                style={{ color: 'var(--color-text-muted)' }}
              >
                收起
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AIInlineFeedback;
