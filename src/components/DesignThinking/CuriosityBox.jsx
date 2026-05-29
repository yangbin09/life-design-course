import React, { useState } from 'react';
import { Sparkles, Plus, Trash2, Shuffle, X, Wand2, ChevronDown, ChevronUp } from 'lucide-react';
import { getCardStyle, getButtonStyle, getTitleStyle, getDescStyle } from '../../styles/components';
import useAI from '../../hooks/useAI';
import AIStreamingText from '../AI/AIStreamingText';
import { CURIOSITY_EXPLORE_PROMPT } from '../../data/aiPrompts';

const CURIOSITY_CATEGORIES = [
  { key: 'skill', label: '想学的技能' },
  { key: 'place', label: '想去的地方' },
  { key: 'person', label: '想认识的人' },
  { key: 'experience', label: '想尝试的事' },
  { key: 'question', label: '想探索的问题' },
  { key: 'general', label: '其他' },
];

const CuriosityBox = ({ curiosities, onAdd, onRemove, onDrawRandom }) => {
  const [newItem, setNewItem] = useState({ text: '', category: 'general' });
  const [randomPick, setRandomPick] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [exploringId, setExploringId] = useState(null);
  const [explorationResult, setExplorationResult] = useState('');
  const { loading: aiLoading, streamingText, generateStreamingWithTemplate } = useAI();

  const handleExplore = async (item) => {
    if (exploringId === item.id) {
      setExploringId(null);
      setExplorationResult('');
      return;
    }
    setExploringId(item.id);
    setExplorationResult('');
    try {
      const cat = CURIOSITY_CATEGORIES.find(c => c.key === item.category);
      const text = await generateStreamingWithTemplate(CURIOSITY_EXPLORE_PROMPT, {
        curiosity: item.text,
        category: cat?.label || '其他',
      });
      setExplorationResult(text);
    } catch (err) {
      setExplorationResult('AI 生成失败: ' + err.message);
    }
  };

  const handleAdd = () => {
    if (!newItem.text.trim()) return;
    onAdd(newItem);
    setNewItem({ text: '', category: 'general' });
    setShowForm(false);
  };

  const handleDraw = () => {
    const picked = onDrawRandom();
    setRandomPick(picked);
  };

  return (
    <div className="space-y-6">
      {/* 标题区 */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-3" style={{ background: 'rgba(181, 101, 29, 0.15)' }}>
          <Sparkles size={28} style={{ color: 'var(--color-accent)' }} />
        </div>
        <h3 className="text-xl font-bold mb-1" style={getTitleStyle('lg')}>好奇心收集箱</h3>
        <p className="text-sm" style={getDescStyle()}>记录一切让你好奇的事物，然后随机抽取一个去探索</p>
      </div>

      {/* 操作区 */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-colors"
          style={getButtonStyle('primary')}
        >
          <Plus size={16} /> 记录好奇
        </button>
        <button
          onClick={handleDraw}
          disabled={curiosities.length === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-colors"
          style={curiosities.length > 0
            ? getButtonStyle('primary')
            : { background: 'var(--color-bg-elevated)', color: 'var(--color-text-muted)', cursor: 'not-allowed' }
          }
        >
          <Shuffle size={16} /> 随机抽取
        </button>
      </div>

      {/* 添加表单 */}
      {showForm && (
        <div className="rounded-xl p-5 space-y-3" style={{ background: 'rgba(181, 101, 29, 0.08)', border: '1px solid rgba(181, 101, 29, 0.25)' }}>
          <textarea
            value={newItem.text}
            onChange={(e) => setNewItem(prev => ({ ...prev, text: e.target.value }))}
            placeholder="什么东西让你感到好奇？"
            className="w-full p-3 rounded-lg border text-sm resize-none focus:outline-none focus:ring-2"
            style={{ background: 'var(--color-bg-card)', borderColor: 'var(--border-light)', color: 'var(--color-text)', '--tw-ring-color': 'var(--color-accent)' }}
            rows={2}
          />
          <div className="flex items-center gap-2 flex-wrap">
            {CURIOSITY_CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => setNewItem(prev => ({ ...prev, category: cat.key }))}
                className="text-xs px-3 py-1 rounded-full border transition-all"
                style={newItem.category === cat.key
                  ? { background: 'var(--color-accent)', color: 'white', borderColor: 'var(--color-accent)' }
                  : { background: 'var(--color-bg-card)', color: 'var(--color-text-secondary)', borderColor: 'var(--border-light)' }
                }
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowForm(false)} className="text-xs px-3 py-1.5" style={{ color: 'var(--color-text-muted)' }}>
              取消
            </button>
            <button
              onClick={handleAdd}
              className="text-xs px-4 py-1.5 rounded-lg"
              style={getButtonStyle('primary')}
            >
              添加
            </button>
          </div>
        </div>
      )}

      {/* 随机抽取结果 */}
      {randomPick && (
        <div className="rounded-2xl p-6 text-center relative" style={{ background: 'linear-gradient(135deg, rgba(198, 123, 92, 0.08), rgba(181, 101, 29, 0.08))', border: '2px solid rgba(198, 123, 92, 0.3)' }}>
          <button
            onClick={() => setRandomPick(null)}
            className="absolute top-3 right-3"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <X size={16} />
          </button>
          <div className="text-sm font-bold mb-2" style={{ color: 'var(--color-primary)' }}>今天的好奇探索</div>
          <p className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>{randomPick.text}</p>
          <div className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
            {CURIOSITY_CATEGORIES.find(c => c.key === randomPick.category)?.label || '其他'}
          </div>
        </div>
      )}

      {/* 收集列表 */}
      {curiosities.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>已收集 ({curiosities.length})</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {curiosities.map((item) => {
              const cat = CURIOSITY_CATEGORIES.find(c => c.key === item.category);
              return (
                <div key={item.id} className="rounded-xl group transition-all" style={getCardStyle()}>
                  <div className="flex items-start gap-3 p-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm line-clamp-2" style={{ color: 'var(--color-text)' }}>{item.text}</p>
                      <span className="text-[10px] mt-1 block" style={{ color: 'var(--color-text-muted)' }}>{cat?.label || '其他'}</span>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleExplore(item)}
                        className="p-1.5 rounded-lg transition-colors"
                        style={exploringId === item.id
                          ? { backgroundColor: 'var(--color-accent)', color: 'white' }
                          : { color: 'var(--color-accent)' }
                        }
                        title="AI 追问探索"
                      >
                        {exploringId === item.id ? <ChevronUp size={14} /> : <Wand2 size={14} />}
                      </button>
                      <button
                        onClick={() => onRemove(item.id)}
                        className="opacity-0 group-hover:opacity-100 transition-all p-1.5"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  {exploringId === item.id && (
                    <div className="px-3 pb-3 pt-0">
                      <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--color-bg)', border: 'var(--border-warm)' }}>
                        <p className="text-[10px] font-bold mb-2" style={{ color: 'var(--color-accent)' }}>AI 探索追问</p>
                        <AIStreamingText text={explorationResult || streamingText} loading={aiLoading} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {curiosities.length === 0 && (
        <div className="text-center py-8" style={{ color: 'var(--color-text-muted)' }}>
          <Sparkles size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">好奇心收集箱是空的</p>
          <p className="text-xs mt-1">记录你好奇的事物，开始探索之旅</p>
        </div>
      )}
    </div>
  );
};

export default CuriosityBox;
