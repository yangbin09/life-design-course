import React, { useState } from 'react';
import { CalendarDays, Plus, Save, Edit3, ChevronDown, ChevronUp, Wand2 } from 'lucide-react';
import { getCardStyle, getTitleStyle, getDescStyle, getButtonStyle } from '../../styles/components';
import useAI from '../../hooks/useAI';
import AIStreamingText from '../AI/AIStreamingText';
import { ANNUAL_REVIEW_PROMPT } from '../../data/aiPrompts';

const AnnualReview = ({ reviews, template, onAdd, onUpdate }) => {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [sections, setSections] = useState(
    template.sections.map(s => ({ ...s, items: [''] }))
  );
  const [isEditing, setIsEditing] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [aiGenerating, setAiGenerating] = useState(false);
  const { loading: aiLoading, streamingText, generateStreamingWithTemplate } = useAI();

  const handleAIGenerate = async () => {
    setAiGenerating(true);
    try {
      const text = await generateStreamingWithTemplate(ANNUAL_REVIEW_PROMPT, {
        dashboard: '暂无数据',
        journalHighlights: '暂无数据',
        milestones: '暂无数据',
        stories: '暂无数据',
      });
      // 将 AI 生成的文本按段落分配到各个 section
      const paragraphs = text.split('\n\n').filter(p => p.trim());
      setSections(prev => prev.map((section, idx) => {
        if (idx < paragraphs.length) {
          // 从段落中提取条目（按换行或序号分割）
          const items = paragraphs[idx]
            .split('\n')
            .map(line => line.replace(/^[\d\-\*]+[\.\、\)]?\s*/, '').trim())
            .filter(line => line.length > 0);
          return { ...section, items: items.length > 0 ? items : [paragraphs[idx].trim()] };
        }
        return section;
      }));
    } catch (err) {
      // AI 生成失败时不做处理，用户仍可手动填写
    } finally {
      setAiGenerating(false);
    }
  };

  const handleItemChange = (sectionIdx, itemIdx, value) => {
    setSections(prev => {
      const next = [...prev];
      next[sectionIdx] = {
        ...next[sectionIdx],
        items: next[sectionIdx].items.map((item, i) => (i === itemIdx ? value : item)),
      };
      return next;
    });
  };

  const addItem = (sectionIdx) => {
    setSections(prev => {
      const next = [...prev];
      next[sectionIdx] = {
        ...next[sectionIdx],
        items: [...next[sectionIdx].items, ''],
      };
      return next;
    });
  };

  const removeItem = (sectionIdx, itemIdx) => {
    setSections(prev => {
      const next = [...prev];
      next[sectionIdx] = {
        ...next[sectionIdx],
        items: next[sectionIdx].items.filter((_, i) => i !== itemIdx),
      };
      return next;
    });
  };

  const handleSave = () => {
    const filledSections = sections.map(s => ({
      ...s,
      items: s.items.filter(item => item.trim()),
    }));
    onAdd(year, filledSections);
    setIsEditing(false);
    setSections(template.sections.map(s => ({ ...s, items: [''] })));
  };

  const cardStyle = getCardStyle();
  const titleStyle = getTitleStyle('lg');
  const descStyle = getDescStyle();
  const primaryBtnStyle = getButtonStyle('primary');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-3" style={{ backgroundColor: 'var(--color-bg-elevated)' }}>
          <CalendarDays style={{ color: 'var(--color-accent)' }} size={28} />
        </div>
        <h3 style={{ ...titleStyle, fontSize: '1.25rem', marginBottom: '0.25rem' }}>人生设计年度回顾</h3>
        <p style={descStyle}>回顾过去，设计未来</p>
      </div>

      {/* 编辑新回顾 */}
      {!isEditing ? (
        <button
          onClick={() => setIsEditing(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors"
          style={{ border: '2px dashed var(--border-warm)', color: 'var(--color-accent)' }}
        >
          <Plus size={16} /> 开始新年回顾
        </button>
      ) : (
        <div style={cardStyle} className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <label className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>回顾年份:</label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-24 p-2 rounded-lg text-sm text-center font-bold focus:outline-none focus:ring-2"
                style={{ border: 'var(--border-light)', backgroundColor: 'var(--color-bg-card)' }}
              />
            </div>
            <button
              onClick={handleAIGenerate}
              disabled={aiLoading || aiGenerating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              style={aiLoading || aiGenerating
                ? { backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-muted)', cursor: 'not-allowed' }
                : { backgroundColor: 'var(--color-accent)', color: 'white' }
              }
            >
              <Wand2 size={12} /> {aiLoading || aiGenerating ? 'AI 生成中...' : 'AI 生成回顾'}
            </button>
          </div>
          {(streamingText && aiGenerating) && (
            <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--color-bg)', border: 'var(--border-light)' }}>
              <p className="text-[10px] font-bold mb-2" style={{ color: 'var(--color-accent)' }}>AI 正在生成回顾草稿...</p>
              <AIStreamingText text={streamingText} loading={aiLoading} />
            </div>
          )}

          {sections.map((section, sIdx) => (
            <div key={section.id} className="rounded-xl p-4" style={{ backgroundColor: 'var(--color-bg)', border: 'var(--border-warm)' }}>
              <h5 className="font-bold text-sm mb-1" style={{ color: 'var(--color-text)' }}>{section.title}</h5>
              <p className="text-xs mb-3" style={{ color: 'var(--color-text-muted)' }}>{section.prompt}</p>

              <div className="space-y-2">
                {section.items.map((item, iIdx) => (
                  <div key={iIdx} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleItemChange(sIdx, iIdx, e.target.value)}
                      placeholder={`第 ${iIdx + 1} 条...`}
                      className="flex-1 p-2 rounded-lg text-sm focus:outline-none focus:ring-2"
                      style={{ border: 'var(--border-light)', backgroundColor: 'var(--color-bg-card)' }}
                    />
                    {section.items.length > 1 && (
                      <button
                        onClick={() => removeItem(sIdx, iIdx)}
                        className="px-2"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        x
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={() => addItem(sIdx)}
                className="mt-2 text-xs flex items-center gap-1"
                style={{ color: 'var(--color-accent)' }}
              >
                <Plus size={12} /> 添加一条
              </button>
            </div>
          ))}

          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-sm"
              style={{ color: 'var(--color-text-muted)' }}
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-colors"
              style={primaryBtnStyle}
            >
              <Save size={14} /> 保存回顾
            </button>
          </div>
        </div>
      )}

      {/* 已有回顾 */}
      {reviews.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>过往回顾 ({reviews.length})</h4>
          {reviews.map((review) => {
            const isExpanded = expandedId === review.id;
            return (
              <div key={review.id} style={cardStyle} className="overflow-hidden">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : review.id)}
                  className="w-full flex items-center justify-between p-4 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold" style={{ color: 'var(--color-accent)' }}>{review.year}</span>
                    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>年度回顾</span>
                  </div>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 space-y-4 pt-4" style={{ borderTop: 'var(--border-light)' }}>
                    {review.sections.filter(s => s.items && s.items.length > 0).map((section) => (
                      <div key={section.id}>
                        <h6 className="font-bold text-sm mb-1" style={{ color: 'var(--color-text)' }}>{section.title}</h6>
                        <ul className="space-y-1">
                          {section.items.map((item, i) => (
                            <li key={i} className="text-sm flex gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                              <span style={{ color: 'var(--color-text-muted)' }}>-</span> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <div className="text-[10px] text-right" style={{ color: 'var(--color-text-muted)' }}>
                      {new Date(review.timestamp).toLocaleDateString('zh-CN')}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {reviews.length === 0 && !isEditing && (
        <div className="text-center py-8" style={{ color: 'var(--color-text-muted)' }}>
          <CalendarDays size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">还没有年度回顾</p>
          <p className="text-xs mt-1">回顾过去的一年，设计新的一年</p>
        </div>
      )}
    </div>
  );
};

export default AnnualReview;
