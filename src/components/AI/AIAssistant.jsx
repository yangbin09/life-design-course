import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Loader2, Trash2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import useAIChat from '../../hooks/useAIChat';
import { QUICK_QUESTIONS } from '../../data/aiPrompts';
import { getCardStyle } from '../../styles/components';

const AIAssistant = () => {
  const location = useLocation();
  const {
    messages, loading, error, streamingText,
    sendMessage, clearHistory, isConfigured,
  } = useAIChat();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const getQuickQuestions = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return QUICK_QUESTIONS.dashboard;
    if (path.includes('journal')) return QUICK_QUESTIONS.journal;
    if (path.includes('compass')) return QUICK_QUESTIONS.compass;
    if (path.includes('odyssey')) return QUICK_QUESTIONS.odyssey;
    if (path.includes('prototype')) return QUICK_QUESTIONS.prototype;
    if (path.includes('design')) return QUICK_QUESTIONS.designThinking;
    if (path.includes('journey')) return QUICK_QUESTIONS.journey;
    return QUICK_QUESTIONS.default;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async (text = input) => {
    if (!text.trim() || loading) return;
    setInput('');
    try {
      await sendMessage(text.trim());
    } catch (err) {
      // error is handled by useAIChat
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* 浮动按钮 */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
            boxShadow: '0 4px 20px rgba(198,123,92,0.4)',
          }}
        >
          <Sparkles size={24} className="text-white" />
          {messages.length > 0 && (
            <div
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
              style={{ background: 'var(--color-error)' }}
            >
              {messages.length > 9 ? '9+' : messages.length}
            </div>
          )}
        </button>
      )}

      {/* 对话面板 */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 z-40 w-[380px] h-[520px] flex flex-col rounded-2xl overflow-hidden"
          style={{
            ...getCardStyle(true),
            boxShadow: '0 8px 40px rgba(74,55,40,0.2)',
          }}
        >
          {/* 头部 */}
          <div
            className="px-4 py-3 flex items-center justify-between"
            style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' }}
          >
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-white" />
              <span className="text-sm font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                人生设计助手
              </span>
              {messages.length > 0 && (
                <span className="text-[10px] text-white/60">
                  ({messages.length} 条对话)
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-white/60 hover:text-white p-1 rounded transition-colors cursor-pointer"
                  title="清空对话"
                >
                  <Trash2 size={14} />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* 消息区域 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: 'var(--color-bg)' }}>
            {!isConfigured ? (
              <div className="text-center py-12">
                <Sparkles size={32} className="mx-auto mb-3" style={{ color: 'var(--color-text-muted)' }} />
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>
                  请先配置 AI
                </p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  点击侧边栏的 AI 设置按钮配置 API Key
                </p>
              </div>
            ) : messages.length === 0 ? (
              <div>
                <div className="text-center mb-4">
                  <div
                    className="w-12 h-12 mx-auto mb-2 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' }}
                  >
                    <Sparkles size={24} className="text-white" />
                  </div>
                  <p className="text-sm font-medium" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>
                    你好！我是你的人生设计助手
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                    我了解你所有的人生设计数据，随时问我
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-medium" style={{ color: 'var(--color-text-muted)' }}>
                    试试问我：
                  </p>
                  {getQuickQuestions().map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(q)}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs transition-all cursor-pointer"
                      style={{
                        background: 'var(--color-bg-card)',
                        border: 'var(--border-light)',
                        color: 'var(--color-text-secondary)',
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className="max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap"
                      style={{
                        background: msg.role === 'user'
                          ? 'linear-gradient(135deg, var(--color-primary), var(--color-accent))'
                          : 'var(--color-bg-card)',
                        color: msg.role === 'user' ? 'white' : 'var(--color-text)',
                        fontFamily: 'var(--font-body)',
                        borderBottomRightRadius: msg.role === 'user' ? '4px' : undefined,
                        borderBottomLeftRadius: msg.role === 'assistant' ? '4px' : undefined,
                        boxShadow: 'var(--shadow-soft)',
                      }}
                    >
                      {msg.content || <Loader2 size={14} className="animate-spin" />}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* 输入区域 */}
          {isConfigured && (
            <div className="p-3" style={{ borderTop: 'var(--border-light)', background: 'var(--color-bg-card)' }}>
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="输入你的问题..."
                  className="flex-1 px-3 py-2 rounded-xl text-sm transition-all"
                  style={{
                    background: 'var(--color-bg)',
                    border: 'var(--border-warm)',
                    color: 'var(--color-text)',
                    fontFamily: 'var(--font-body)',
                  }}
                  disabled={loading}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || loading}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer"
                  style={{
                    background: input.trim() && !loading
                      ? 'linear-gradient(135deg, var(--color-primary), var(--color-accent))'
                      : 'var(--color-bg-elevated)',
                    color: input.trim() && !loading ? 'white' : 'var(--color-text-muted)',
                  }}
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AIAssistant;
