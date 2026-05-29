import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, Edit3, Save, X, Search, Tag } from 'lucide-react';
import { getCardStyle, getTitleStyle, getDescStyle, getButtonStyle } from '../../styles/components';

const MOOD_OPTIONS = [
  { key: 'inspired', label: '受启发', emoji: '✨' },
  { key: 'grateful', label: '感恩', emoji: '🙏' },
  { key: 'excited', label: '兴奋', emoji: '🎉' },
  { key: 'peaceful', label: '平静', emoji: '🌿' },
  { key: 'challenged', label: '受挑战', emoji: '💪' },
  { key: 'neutral', label: '平常', emoji: '📝' },
];

const StoryLibrary = ({ stories, onAdd, onUpdate, onRemove }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', tags: [], mood: 'neutral' });
  const [tagInput, setTagInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMood, setFilterMood] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const resetForm = () => {
    setForm({ title: '', content: '', tags: [], mood: 'neutral' });
    setTagInput('');
    setShowForm(false);
    setEditingId(null);
  };

  const handleAdd = () => {
    if (!form.title.trim()) return;
    if (editingId) {
      onUpdate(editingId, form);
    } else {
      onAdd(form);
    }
    resetForm();
  };

  const handleEdit = (story) => {
    setForm({
      title: story.title,
      content: story.content,
      tags: [...story.tags],
      mood: story.mood,
    });
    setEditingId(story.id);
    setShowForm(true);
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (!tag || form.tags.includes(tag)) return;
    setForm(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    setTagInput('');
  };

  const removeTag = (tag) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  // 筛选故事
  const filtered = stories.filter(s => {
    const matchSearch = !searchTerm ||
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchMood = filterMood === 'all' || s.mood === filterMood;
    return matchSearch && matchMood;
  });

  const cardStyle = getCardStyle();
  const titleStyle = getTitleStyle('lg');
  const descStyle = getDescStyle();
  const primaryBtnStyle = getButtonStyle('primary');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-3" style={{ backgroundColor: 'var(--color-bg-elevated)' }}>
          <BookOpen style={{ color: 'var(--color-accent)' }} size={28} />
        </div>
        <h3 style={{ ...titleStyle, fontSize: '1.25rem', marginBottom: '0.25rem' }}>人生设计访谈故事库</h3>
        <p style={descStyle}>收集和分享你听到的故事，从中获得灵感</p>
      </div>

      {/* 搜索与筛选 */}
      {stories.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索故事..."
              className="w-full pl-9 pr-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2"
              style={{ border: 'var(--border-light)', backgroundColor: 'var(--color-bg-card)' }}
            />
          </div>
          <select
            value={filterMood}
            onChange={(e) => setFilterMood(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2"
            style={{ border: 'var(--border-light)', backgroundColor: 'var(--color-bg-card)' }}
          >
            <option value="all">所有心情</option>
            {MOOD_OPTIONS.map(m => (
              <option key={m.key} value={m.key}>{m.emoji} {m.label}</option>
            ))}
          </select>
        </div>
      )}

      {/* 添加按钮 */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors"
          style={{ border: '2px dashed var(--border-warm)', color: 'var(--color-accent)' }}
        >
          <Plus size={16} /> 记录一个故事
        </button>
      )}

      {/* 表单 */}
      {showForm && (
        <div style={cardStyle} className="p-5 space-y-4">
          <h4 className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
            {editingId ? '编辑故事' : '记录新故事'}
          </h4>

          <div>
            <label className="text-xs font-bold block mb-1" style={{ color: 'var(--color-text-secondary)' }}>故事标题</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
              placeholder="给故事起个名字"
              className="w-full p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2"
              style={{ border: 'var(--border-light)', backgroundColor: 'var(--color-bg-card)' }}
            />
          </div>

          <div>
            <label className="text-xs font-bold block mb-1" style={{ color: 'var(--color-text-secondary)' }}>故事内容</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
              placeholder="记录这个故事..."
              className="w-full p-3 rounded-lg text-sm resize-none focus:outline-none focus:ring-2"
              style={{ border: 'var(--border-light)', backgroundColor: 'var(--color-bg-card)' }}
              rows={4}
            />
          </div>

          {/* 心情选择 */}
          <div>
            <label className="text-xs font-bold block mb-2" style={{ color: 'var(--color-text-secondary)' }}>故事心情</label>
            <div className="flex gap-2 flex-wrap">
              {MOOD_OPTIONS.map(m => (
                <button
                  key={m.key}
                  onClick={() => setForm(prev => ({ ...prev, mood: m.key }))}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border transition-all"
                  style={form.mood === m.key
                    ? { backgroundColor: 'var(--color-accent)', color: 'white', borderColor: 'var(--color-accent)' }
                    : { backgroundColor: 'var(--color-bg-card)', color: 'var(--color-text-secondary)', borderColor: 'var(--border-light)' }}
                >
                  {m.emoji} {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* 标签 */}
          <div>
            <label className="text-xs font-bold block mb-2" style={{ color: 'var(--color-text-secondary)' }}>标签</label>
            <div className="flex flex-wrap gap-1 mb-2">
              {form.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-accent)' }}>
                  <Tag size={10} /> {tag}
                  <button onClick={() => removeTag(tag)} style={{ color: 'var(--color-text-muted)' }}>
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTag()}
                placeholder="添加标签"
                className="flex-1 p-2 rounded-lg text-sm focus:outline-none focus:ring-2"
                style={{ border: 'var(--border-light)', backgroundColor: 'var(--color-bg-card)' }}
              />
              <button
                onClick={addTag}
                className="px-3 rounded-lg text-sm"
                style={{ backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-accent)' }}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <button onClick={resetForm} className="text-xs px-3 py-1.5" style={{ color: 'var(--color-text-muted)' }}>取消</button>
            <button
              onClick={handleAdd}
              disabled={!form.title.trim()}
              className="text-xs px-4 py-1.5 rounded-lg transition-colors"
              style={form.title.trim()
                ? { ...primaryBtnStyle, borderRadius: 'var(--radius-md)' }
                : { backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-muted)', cursor: 'not-allowed', borderRadius: 'var(--radius-md)' }}
            >
              {editingId ? '保存修改' : '保存故事'}
            </button>
          </div>
        </div>
      )}

      {/* 故事列表 */}
      {filtered.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>共 {filtered.length} 个故事</p>
          {filtered.map((story) => {
            const isExpanded = expandedId === story.id;
            const mood = MOOD_OPTIONS.find(m => m.key === story.mood);

            return (
              <div key={story.id} style={cardStyle} className="overflow-hidden">
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : story.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">{mood?.emoji}</span>
                        <h5 className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>{story.title}</h5>
                      </div>
                      {!isExpanded && (
                        <p className="text-xs line-clamp-2" style={{ color: 'var(--color-text-muted)' }}>{story.content}</p>
                      )}
                      {story.tags.length > 0 && !isExpanded && (
                        <div className="flex gap-1 mt-2">
                          {story.tags.map(tag => (
                            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-accent)' }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1 ml-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleEdit(story); }}
                        className="p-1.5 transition-colors"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onRemove(story.id); }}
                        className="p-1.5 transition-colors"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-3" style={{ borderTop: 'var(--border-light)' }}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--color-text)' }}>{story.content}</p>
                    {story.tags.length > 0 && (
                      <div className="flex gap-1 mt-3">
                        {story.tags.map(tag => (
                          <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-accent)' }}>
                            <Tag size={8} className="inline mr-0.5" />{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="text-[10px] mt-3 text-right" style={{ color: 'var(--color-text-muted)' }}>
                      {new Date(story.timestamp).toLocaleDateString('zh-CN')}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {stories.length === 0 && !showForm && (
        <div className="text-center py-8" style={{ color: 'var(--color-text-muted)' }}>
          <BookOpen size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">故事库是空的</p>
          <p className="text-xs mt-1">记录你听到的访谈故事，从中获得灵感</p>
        </div>
      )}

      {stories.length > 0 && filtered.length === 0 && (
        <div className="text-center py-8" style={{ color: 'var(--color-text-muted)' }}>
          <Search size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">没有找到匹配的故事</p>
        </div>
      )}
    </div>
  );
};

export default StoryLibrary;
