import React, { useState } from 'react';
import { Plus, Zap, Focus } from 'lucide-react';
import { CATEGORIES, CATEGORY_LABELS, CATEGORY_COLORS } from '../../hooks/useJournal';
import { getCardStyle } from '../../styles/components';

/**
 * 好时光日志输入表单
 * 记录活动名称、能量值、专注度和分类
 */
const JournalEntryForm = ({ onAdd }) => {
  const [form, setForm] = useState({
    name: '',
    energy: 5,
    engagement: 5,
    category: CATEGORIES.WORK,
    note: ''
  });

  const [showMore, setShowMore] = useState(false);

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    onAdd(form);
    setForm({ name: '', energy: 5, engagement: 5, category: CATEGORIES.WORK, note: '' });
    setShowMore(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      className="rounded-xl p-4 md:p-5"
      style={{
        ...getCardStyle(),
        border: 'var(--border-light)',
      }}
    >
      <h4
        className="text-sm font-bold mb-3 flex items-center gap-2"
        style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}
      >
        <Plus size={16} style={{ color: 'var(--color-primary)' }} />
        记录新活动
      </h4>

      {/* 活动名称输入 */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="刚才做了什么？(例: 写方案)"
          className="flex-1 rounded-lg px-3 py-2.5 text-sm transition-colors"
          style={{
            border: 'var(--border-light)',
            fontFamily: 'var(--font-body)',
            color: 'var(--color-text)',
            background: 'var(--color-bg)',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--color-primary)';
            e.target.style.boxShadow = '0 0 0 3px rgba(198, 123, 92, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--border-light)';
            e.target.style.boxShadow = 'none';
          }}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSubmit}
          disabled={!form.name.trim()}
          className="rounded-lg px-4 transition-colors flex items-center gap-1"
          style={{
            background: 'var(--color-primary)',
            color: 'white',
            fontFamily: 'var(--font-body)',
            opacity: !form.name.trim() ? 0.4 : 1,
            cursor: !form.name.trim() ? 'not-allowed' : 'pointer',
          }}
          onMouseEnter={(e) => { if (form.name.trim()) e.currentTarget.style.background = 'var(--color-accent)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-primary)'; }}
        >
          <Plus size={18} />
          <span className="hidden sm:inline text-sm">添加</span>
        </button>
      </div>

      {/* 滑块区域 */}
      <div className="grid grid-cols-2 gap-4 mb-3">
        {/* 专注度 */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold flex items-center gap-1" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}>
              <Focus size={13} style={{ color: 'var(--color-accent)' }} />
              专注度
            </label>
            <span
              className="text-xs font-mono px-1.5 py-0.5 rounded"
              style={{ color: 'var(--color-accent)', background: 'var(--color-bg-elevated)' }}
            >
              {form.engagement}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            value={form.engagement}
            onChange={(e) => setForm({ ...form, engagement: parseInt(e.target.value) })}
            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
            style={{ background: 'var(--color-bg-elevated)', accentColor: 'var(--color-accent)' }}
          />
          <div className="flex justify-between text-[10px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
            <span>分心</span>
            <span>全情投入</span>
          </div>
        </div>

        {/* 能量值 */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold flex items-center gap-1" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}>
              <Zap size={13} style={{ color: 'var(--color-primary)' }} />
              能量
            </label>
            <span
              className="text-xs font-mono px-1.5 py-0.5 rounded"
              style={{ color: 'var(--color-primary)', background: 'var(--color-bg-elevated)' }}
            >
              {form.energy}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            value={form.energy}
            onChange={(e) => setForm({ ...form, energy: parseInt(e.target.value) })}
            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
            style={{ background: 'var(--color-bg-elevated)', accentColor: 'var(--color-primary)' }}
          />
          <div className="flex justify-between text-[10px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
            <span>耗能</span>
            <span>充电</span>
          </div>
        </div>
      </div>

      {/* 分类选择 */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}>活动类型</label>
          <button
            onClick={() => setShowMore(!showMore)}
            className="text-[10px] transition-colors"
            style={{ color: 'var(--color-primary)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-accent)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-primary)'; }}
          >
            {showMore ? '收起' : '展开'}
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(CATEGORIES)
            .filter(([key]) => showMore || ['work', 'study', 'exercise', 'social', 'creative'].includes(key))
            .map(([key]) => (
              <button
                key={key}
                onClick={() => setForm({ ...form, category: key })}
                className="px-2.5 py-1 rounded-full text-xs font-medium transition-all"
                style={
                  form.category === key
                    ? { background: 'var(--color-primary)', color: 'white', boxShadow: '0 0 0 2px var(--color-secondary)' }
                    : { background: 'var(--color-bg-elevated)', color: 'var(--color-text-muted)' }
                }
              >
                {CATEGORY_LABELS[key]}
              </button>
            ))}
        </div>
      </div>

      {/* 备注（可选） */}
      {showMore && (
        <div className="mt-2">
          <textarea
            placeholder="补充说明（可选）"
            rows="2"
            className="w-full rounded-lg px-3 py-2 text-xs transition-colors resize-none"
            style={{
              border: 'var(--border-light)',
              fontFamily: 'var(--font-body)',
              color: 'var(--color-text)',
              background: 'var(--color-bg)',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--color-primary)';
              e.target.style.boxShadow = '0 0 0 3px rgba(198, 123, 92, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-light)';
              e.target.style.boxShadow = 'none';
            }}
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />
        </div>
      )}

      {/* 快速提示 */}
      <div className="mt-3 flex items-center gap-2 text-[10px]" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
        <span>提示：专注度和能量都高 = 心流状态</span>
        <span
          className="px-1.5 py-0.5 rounded font-medium"
          style={{ background: 'var(--color-bg-elevated)', color: 'var(--color-primary)' }}
        >
          好时光
        </span>
      </div>
    </div>
  );
};

export default JournalEntryForm;
