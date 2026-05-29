import React, { useState } from 'react';
import { Trash2, Edit3, Check, X, ChevronDown, ChevronUp, Zap, Focus } from 'lucide-react';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../../hooks/useJournal';
import { getCardStyle } from '../../styles/components';

/**
 * 好时光日志列表
 * 展示所有日志条目，支持编辑和删除
 */
const JournalList = ({ entries, onUpdate, onDelete }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAll, setShowAll] = useState(false);
  const [sortBy, setSortBy] = useState('time'); // time | energy | engagement

  const displayEntries = showAll ? entries : entries.slice(-10);

  // 排序逻辑
  const sortedEntries = [...displayEntries].sort((a, b) => {
    if (sortBy === 'energy') return b.energy - a.energy;
    if (sortBy === 'engagement') return b.engagement - a.engagement;
    return new Date(b.timestamp) - new Date(a.timestamp);
  });

  const startEdit = (entry) => {
    setEditingId(entry.id);
    setEditForm({ name: entry.name, energy: entry.energy, engagement: entry.engagement, category: entry.category });
  };

  const saveEdit = () => {
    if (!editForm.name.trim()) return;
    onUpdate(editingId, editForm);
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) return `今天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    if (isYesterday) return `昨天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const getEnergyStyle = (energy) => {
    if (energy >= 7) return { color: 'var(--color-primary)', background: 'var(--color-bg-elevated)' };
    if (energy >= 4) return { color: 'var(--color-secondary)', background: 'var(--color-bg-elevated)' };
    return { color: 'var(--color-error)', background: 'var(--color-bg-elevated)' };
  };

  const getEngagementStyle = (engagement) => {
    if (engagement >= 7) return { color: 'var(--color-accent)', background: 'var(--color-bg-elevated)' };
    if (engagement >= 4) return { color: 'var(--color-accent)', background: 'var(--color-bg-elevated)' };
    return { color: 'var(--color-text-muted)', background: 'var(--color-bg-elevated)' };
  };

  if (entries.length === 0) {
    return (
      <div
        className="rounded-xl p-8 text-center"
        style={{ background: 'var(--color-bg-card)', border: 'var(--border-light)', borderStyle: 'dashed' }}
      >
        <div className="text-4xl mb-3">
          <Zap className="w-10 h-10 mx-auto" style={{ color: 'var(--color-text-muted)' }} />
        </div>
        <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>还没有记录</p>
        <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>记录那些让你充满能量和全情投入的活动</p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl"
      style={{ ...getCardStyle(), border: 'var(--border-light)' }}
    >
      {/* 头部操作栏 */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: 'var(--border-light)' }}
      >
        <h4
          className="text-sm font-bold flex items-center gap-2"
          style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
        >
          活动记录
          <span
            className="text-xs font-normal px-2 py-0.5 rounded-full"
            style={{ color: 'var(--color-text-muted)', background: 'var(--color-bg-elevated)', fontFamily: 'var(--font-body)' }}
          >
            {entries.length}条
          </span>
        </h4>
        <div className="flex gap-1">
          {['time', 'energy', 'engagement'].map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className="text-[10px] px-2 py-1 rounded transition-colors"
              style={
                sortBy === s
                  ? { background: 'var(--color-bg-elevated)', color: 'var(--color-primary)', fontFamily: 'var(--font-body)', fontWeight: 600 }
                  : { color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }
              }
            >
              {s === 'time' ? '时间' : s === 'energy' ? '能量' : '专注'}
            </button>
          ))}
        </div>
      </div>

      {/* 列表内容 */}
      <div className="max-h-[400px] overflow-y-auto">
        {sortedEntries.map((entry) => (
          <div
            key={entry.id}
            className="px-4 py-3 transition-colors group"
            style={{ borderBottom: 'var(--border-light)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-bg-elevated)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            {editingId === entry.id ? (
              /* 编辑模式 */
              <div className="space-y-2">
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full rounded px-2 py-1.5 text-sm focus:outline-none"
                  style={{
                    border: 'var(--border-light)',
                    fontFamily: 'var(--font-body)',
                    color: 'var(--color-text)',
                  }}
                  autoFocus
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] block mb-0.5" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>专注度: {editForm.engagement}</label>
                    <input
                      type="range" min="0" max="10"
                      value={editForm.engagement}
                      onChange={(e) => setEditForm({ ...editForm, engagement: parseInt(e.target.value) })}
                      className="w-full h-1 rounded appearance-none cursor-pointer"
                      style={{ background: 'var(--color-bg-elevated)', accentColor: 'var(--color-accent)' }}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] block mb-0.5" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>能量: {editForm.energy}</label>
                    <input
                      type="range" min="0" max="10"
                      value={editForm.energy}
                      onChange={(e) => setEditForm({ ...editForm, energy: parseInt(e.target.value) })}
                      className="w-full h-1 rounded appearance-none cursor-pointer"
                      style={{ background: 'var(--color-bg-elevated)', accentColor: 'var(--color-primary)' }}
                    />
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={saveEdit}
                    className="flex-1 text-xs py-1.5 rounded flex items-center justify-center gap-1"
                    style={{ background: 'var(--color-primary)', color: 'white', fontFamily: 'var(--font-body)' }}
                  >
                    <Check size={13} /> 保存
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex-1 text-xs py-1.5 rounded flex items-center justify-center gap-1"
                    style={{ background: 'var(--color-bg-elevated)', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}
                  >
                    <X size={13} /> 取消
                  </button>
                </div>
              </div>
            ) : (
              /* 展示模式 */
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium truncate" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}>{entry.name}</span>
                    {entry.engagement >= 7 && entry.energy >= 7 && (
                      <span
                        className="text-[9px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0"
                        style={{ background: 'var(--color-bg-elevated)', color: 'var(--color-primary)' }}
                      >
                        心流
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded"
                      style={{ background: 'var(--color-bg-elevated)', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}
                    >
                      {CATEGORY_LABELS[entry.category] || entry.category}
                    </span>
                    <span className="text-[10px]" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>{formatTime(entry.timestamp)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* 能量和专注指标 */}
                  <div className="flex gap-1.5">
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded font-mono"
                      style={getEngagementStyle(entry.engagement)}
                    >
                      专注 {entry.engagement}
                    </span>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded font-mono"
                      style={getEnergyStyle(entry.energy)}
                    >
                      能量 {entry.energy}
                    </span>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit(entry)}
                      className="p-1 transition-colors"
                      style={{ color: 'var(--color-text-muted)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-accent)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)'; }}
                      title="编辑"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={() => onDelete(entry.id)}
                      className="p-1 transition-colors"
                      style={{ color: 'var(--color-text-muted)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-error)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)'; }}
                      title="删除"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 展开/收起 */}
      {entries.length > 10 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full py-2.5 text-xs transition-colors flex items-center justify-center gap-1"
          style={{ color: 'var(--color-primary)', borderTop: 'var(--border-light)', fontFamily: 'var(--font-body)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--color-accent)';
            e.currentTarget.style.background = 'var(--color-bg-elevated)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--color-primary)';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          {showAll ? (
            <>收起 <ChevronUp size={14} /></>
          ) : (
            <>展开全部 {entries.length} 条 <ChevronDown size={14} /></>
          )}
        </button>
      )}
    </div>
  );
};

export default JournalList;
