import React, { useState } from 'react';
import { Wand2, Loader2, X, Copy, Check } from 'lucide-react';
import useAI from '../../hooks/useAI';
import { useAIContext } from '../../contexts/AIContext';
import { getCardStyle, getButtonStyle } from '../../styles/components';

/**
 * AI 智能填充弹窗
 * 输入关键词，AI 生成完整内容
 */
const AISmartFill = ({ isOpen, onClose, onFill, prompt, title = 'AI 智能填充', placeholder = '描述你想要的内容...' }) => {
  const { loading, generateStreamingWithTemplate, streamingText, isConfigured } = useAI();
  const { getSystemPromptWithContext, buildUserSummary } = useAIContext();
  const [keyword, setKeyword] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !isConfigured) return null;

  const handleGenerate = async () => {
    if (!keyword.trim()) return;
    setResult('');
    try {
      const fullPrompt = `${prompt}

用户关键词：${keyword}

用户数据画像：
${buildUserSummary}

请根据以上信息生成内容。直接输出内容，不要解释。`;

      const text = await generateStreamingWithTemplate(fullPrompt);
      setResult(text);
    } catch (err) {
      setResult(`生成失败: ${err.message}`);
    }
  };

  const handleFill = () => {
    onFill?.(result);
    onClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(74, 55, 40, 0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl p-6 max-w-lg w-full mx-4"
        style={{ ...getCardStyle(true), boxShadow: 'var(--shadow-large)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Wand2 size={18} style={{ color: 'var(--color-primary)' }} />
            <h3
              className="text-lg font-bold"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
            >
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* 输入 */}
        <div className="mb-4">
          <input
            type="text"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleGenerate()}
            placeholder={placeholder}
            className="w-full px-4 py-3 rounded-xl text-sm transition-all"
            style={{
              background: 'var(--color-bg)',
              border: 'var(--border-warm)',
              color: 'var(--color-text)',
              fontFamily: 'var(--font-body)',
            }}
          />
        </div>

        {/* 生成按钮 */}
        <button
          onClick={handleGenerate}
          disabled={loading || !keyword.trim()}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer mb-4"
          style={{
            ...getButtonStyle('primary'),
            opacity: loading || !keyword.trim() ? 0.5 : 1,
          }}
        >
          {loading ? (
            <><Loader2 size={14} className="animate-spin" /> 生成中...</>
          ) : (
            <><Wand2 size={14} /> AI 生成</>
          )}
        </button>

        {/* 结果 */}
        {(streamingText || result) && (
          <div
            className="p-4 rounded-xl text-sm leading-relaxed max-h-60 overflow-y-auto mb-4"
            style={{
              background: 'var(--color-bg-elevated)',
              border: 'var(--border-light)',
              color: 'var(--color-text)',
              fontFamily: 'var(--font-body)',
            }}
          >
            <div className="whitespace-pre-wrap">{streamingText || result}</div>
          </div>
        )}

        {/* 操作按钮 */}
        {result && !loading && (
          <div className="flex gap-2">
            <button
              onClick={handleFill}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer"
              style={getButtonStyle('primary')}
            >
              <Check size={14} /> 使用此内容
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer"
              style={getButtonStyle('secondary')}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? '已复制' : '复制'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AISmartFill;
