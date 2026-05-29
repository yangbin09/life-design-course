import React, { useState } from 'react';
import { RefreshCw, Plus, Trash2, Lightbulb, ArrowRight } from 'lucide-react';
import { getCardStyle, getButtonStyle, getTitleStyle, getDescStyle } from '../../styles/components';

const REFRAME_PROMPTS = [
  '把"我必须..."改成"我选择..."',
  '从5年后的视角看这个问题',
  '如果资源无限，你会怎么做？',
  '如果这是一个机会而不是问题呢？',
  '你的对手会怎么解决这个？',
  '如果只能保留一个要素，你选哪个？',
  '把问题反过来说',
  '一个5岁的孩子会怎么想这个问题？',
];

const ReframeTrainer = ({ reframes, onAdd, onRemove }) => {
  const [original, setOriginal] = useState('');
  const [reframed, setReframed] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState(
    REFRAME_PROMPTS[Math.floor(Math.random() * REFRAME_PROMPTS.length)]
  );
  const [showForm, setShowForm] = useState(false);

  const shufflePrompt = () => {
    let next = currentPrompt;
    while (next === currentPrompt && REFRAME_PROMPTS.length > 1) {
      next = REFRAME_PROMPTS[Math.floor(Math.random() * REFRAME_PROMPTS.length)];
    }
    setCurrentPrompt(next);
  };

  const handleAdd = () => {
    if (!original.trim() || !reframed.trim()) return;
    onAdd(original, reframed);
    setOriginal('');
    setReframed('');
    setShowForm(false);
    shufflePrompt();
  };

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-3" style={{ background: 'rgba(198, 123, 92, 0.15)' }}>
          <RefreshCw size={28} style={{ color: 'var(--color-primary)' }} />
        </div>
        <h3 className="text-xl font-bold mb-1" style={getTitleStyle('lg')}>重构思维训练器</h3>
        <p className="text-sm" style={getDescStyle()}>卡住时，换个角度看问题。练习把困境变成机遇。</p>
      </div>

      {/* 提示卡 */}
      <div className="rounded-xl p-5 flex items-center gap-4" style={{ background: 'linear-gradient(135deg, rgba(198, 123, 92, 0.08), rgba(212, 196, 168, 0.15))', border: '1px solid rgba(198, 123, 92, 0.25)' }}>
        <Lightbulb size={24} className="flex-shrink-0" style={{ color: 'var(--color-accent)' }} />
        <div className="flex-1">
          <p className="text-sm font-bold mb-1" style={{ color: 'var(--color-text)' }}>重构提示</p>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{currentPrompt}</p>
        </div>
        <button
          onClick={shufflePrompt}
          className="p-2 rounded-lg transition-colors"
          style={{ color: 'var(--color-text-muted)' }}
          title="换一个提示"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* 添加按钮 */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-xl text-sm font-medium transition-colors"
          style={{ borderColor: 'rgba(198, 123, 92, 0.3)', color: 'var(--color-primary)' }}
        >
          <Plus size={16} /> 记录一次重构练习
        </button>
      )}

      {/* 添加表单 */}
      {showForm && (
        <div className="rounded-xl p-5 space-y-4" style={getCardStyle()}>
          <div>
            <label className="text-xs font-bold block mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>原来的表述（困境）</label>
            <textarea
              value={original}
              onChange={(e) => setOriginal(e.target.value)}
              placeholder='例如："我想转行，但我不够年轻了"'
              className="w-full p-3 rounded-lg border text-sm resize-none focus:outline-none focus:ring-2"
              style={{ background: 'var(--color-bg)', borderColor: 'var(--border-light)', color: 'var(--color-text)', '--tw-ring-color': 'var(--color-primary)' }}
              rows={2}
            />
          </div>
          <div className="flex items-center justify-center" style={{ color: 'var(--color-text-muted)' }}>
            <ArrowRight size={20} />
          </div>
          <div>
            <label className="text-xs font-bold block mb-1.5" style={{ color: 'var(--color-primary)' }}>重构后的表述（机遇）</label>
            <textarea
              value={reframed}
              onChange={(e) => setReframed(e.target.value)}
              placeholder='例如："我拥有丰富的人生经验，这正是新领域需要的独特视角"'
              className="w-full p-3 rounded-lg border text-sm resize-none focus:outline-none focus:ring-2"
              style={{ background: 'rgba(198, 123, 92, 0.05)', borderColor: 'rgba(198, 123, 92, 0.2)', color: 'var(--color-text)', '--tw-ring-color': 'var(--color-primary)' }}
              rows={2}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowForm(false)} className="text-xs px-3 py-1.5" style={{ color: 'var(--color-text-muted)' }}>
              取消
            </button>
            <button
              onClick={handleAdd}
              disabled={!original.trim() || !reframed.trim()}
              className="text-xs px-4 py-1.5 rounded-lg transition-colors"
              style={original.trim() && reframed.trim()
                ? getButtonStyle('primary')
                : { background: 'var(--color-bg-elevated)', color: 'var(--color-text-muted)', cursor: 'not-allowed' }
              }
            >
              保存重构
            </button>
          </div>
        </div>
      )}

      {/* 重构记录 */}
      {reframes.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>重构记录 ({reframes.length})</h4>
          {reframes.map((item) => (
            <div key={item.id} className="rounded-xl p-4 group transition-all relative" style={getCardStyle()}>
              <button
                onClick={() => onRemove(item.id)}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <Trash2 size={14} />
              </button>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 rounded-lg p-3" style={{ background: 'rgba(198, 123, 92, 0.08)' }}>
                  <span className="text-[10px] font-bold uppercase" style={{ color: 'var(--color-error)' }}>困境</span>
                  <p className="text-sm mt-1" style={{ color: 'var(--color-text)' }}>{item.original}</p>
                </div>
                <div className="flex items-center justify-center sm:rotate-0 rotate-90" style={{ color: 'var(--color-text-muted)' }}>
                  <ArrowRight size={16} />
                </div>
                <div className="flex-1 rounded-lg p-3" style={{ background: 'rgba(198, 123, 92, 0.12)' }}>
                  <span className="text-[10px] font-bold uppercase" style={{ color: 'var(--color-primary)' }}>机遇</span>
                  <p className="text-sm mt-1" style={{ color: 'var(--color-text)' }}>{item.reframed}</p>
                </div>
              </div>
              <div className="text-[10px] mt-2 text-right" style={{ color: 'var(--color-text-muted)' }}>
                {new Date(item.timestamp).toLocaleDateString('zh-CN')}
              </div>
            </div>
          ))}
        </div>
      )}

      {reframes.length === 0 && !showForm && (
        <div className="text-center py-8" style={{ color: 'var(--color-text-muted)' }}>
          <RefreshCw size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">还没有重构记录</p>
          <p className="text-xs mt-1">开始练习换个角度看问题</p>
        </div>
      )}
    </div>
  );
};

export default ReframeTrainer;
