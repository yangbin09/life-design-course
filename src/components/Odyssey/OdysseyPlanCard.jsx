import React, { useState } from 'react';
import { Edit3, Save, X, ChevronDown, ChevronUp, Sparkles, Loader2 } from 'lucide-react';
import { getCardStyle, getTitleStyle, getDescStyle } from '../../styles/components';
import useAI from '../../hooks/useAI';
import AIButton from '../AI/AIButton';
import AIStreamingText from '../AI/AIStreamingText';
import { ODYSSEY_EXPAND_PROMPT } from '../../data/aiPrompts';

const OdysseyPlanCard = ({ plan, index, colors, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ title: plan.title, desc: plan.desc, detail: plan.detail });
  const [showDetail, setShowDetail] = useState(true);
  const [aiExpanded, setAiExpanded] = useState('');
  const [aiExpandedLoading, setAiExpandedLoading] = useState(false);
  const [showAiExpanded, setShowAiExpanded] = useState(false);
  const { generateStreamingWithTemplate, isConfigured } = useAI();

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({ title: plan.title, desc: plan.desc, detail: plan.detail });
    setIsEditing(false);
  };

  const handleAIExpand = async () => {
    if (!isConfigured || aiExpandedLoading) return;
    setAiExpandedLoading(true);
    setAiExpanded('');
    setShowAiExpanded(true);
    try {
      const text = await generateStreamingWithTemplate(ODYSSEY_EXPAND_PROMPT, {
        title: plan.title,
        description: plan.desc,
        milestones: (plan.milestones || []).map(m => m.label || m).join(', '),
        obstacles: (plan.obstacles || []).map(o => o.text || o).join(', '),
      });
      setAiExpanded(text);
    } catch (err) {
      setAiExpanded(`生成失败: ${err.message}`);
    } finally {
      setAiExpandedLoading(false);
    }
  };

  const handleApplyAISuggestion = () => {
    if (aiExpanded && onUpdate) {
      onUpdate({ ...editData, detail: editData.detail ? `${editData.detail}\n\n---\nAI 扩展建议：\n${aiExpanded}` : `AI 扩展建议：\n${aiExpanded}` });
    }
  };

  if (!plan) return null;

  const titleStyle = getTitleStyle('xl');
  const descStyle = getDescStyle();

  return (
    <div className={`${colors.bg} rounded-2xl border ${colors.border} overflow-hidden`}>
      {/* 卡片头部 */}
      <div className="p-6 md:p-8">
        <div className="flex items-start justify-between mb-4">
          <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white ${colors.badge}`}>
            Plan {index + 1}
          </div>
          {!isEditing ? (
            <div className="flex gap-2">
              {isConfigured && (
                <button
                  onClick={handleAIExpand}
                  disabled={aiExpandedLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-all cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                    color: 'white',
                    opacity: aiExpandedLoading ? 0.7 : 1,
                  }}
                >
                  {aiExpandedLoading ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                  AI 扩展
                </button>
              )}
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-all"
                style={{ color: 'var(--color-text-muted)', backgroundColor: 'var(--color-bg-card)', border: 'var(--border-light)' }}
              >
                <Edit3 size={14} />
                编辑
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white rounded-lg transition-all"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <Save size={14} />
                保存
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-all"
                style={{ color: 'var(--color-text-muted)', backgroundColor: 'var(--color-bg-card)', border: 'var(--border-light)' }}
              >
                <X size={14} />
                取消
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-1" style={{ color: 'var(--color-text-secondary)' }}>计划标题</label>
              <input
                type="text"
                value={editData.title}
                onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 text-lg font-bold"
                style={{ border: 'var(--border-light)', focusRingColor: 'var(--color-primary)' }}
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1" style={{ color: 'var(--color-text-secondary)' }}>一句话描述</label>
              <input
                type="text"
                value={editData.desc}
                onChange={(e) => setEditData(prev => ({ ...prev, desc: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2"
                style={{ border: 'var(--border-light)' }}
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1" style={{ color: 'var(--color-text-secondary)' }}>详细说明</label>
              <textarea
                value={editData.detail}
                onChange={(e) => setEditData(prev => ({ ...prev, detail: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 resize-none"
                style={{ border: 'var(--border-light)' }}
              />
            </div>
          </div>
        ) : (
          <div>
            <h4 style={{ ...titleStyle, fontSize: '1.5rem', marginBottom: '0.5rem' }}>{plan.title}</h4>
            <p className="text-lg leading-relaxed mb-3" style={{ color: 'var(--color-text)' }}>{plan.desc}</p>
            <button
              onClick={() => setShowDetail(!showDetail)}
              className="flex items-center gap-1.5 text-sm transition-colors"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {showDetail ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {showDetail ? '收起详情' : '展开详情'}
            </button>
            {showDetail && (
              <p className="mt-3 leading-relaxed p-4 rounded-lg" style={{ ...descStyle, backgroundColor: 'var(--color-bg-elevated)', border: 'var(--border-light)' }}>
                {plan.detail}
              </p>
            )}
            {/* AI 扩展结果（可折叠） */}
            {showAiExpanded && (aiExpanded || aiExpandedLoading) && (
              <div className="mt-3 p-4 rounded-lg" style={{ background: 'rgba(198,123,92,0.05)', border: '1px solid rgba(198,123,92,0.15)' }}>
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles size={13} style={{ color: 'var(--color-primary)' }} />
                  <span className="text-xs font-medium" style={{ color: 'var(--color-primary)' }}>AI 扩展建议</span>
                  <button
                    onClick={() => setShowAiExpanded(false)}
                    className="ml-auto text-[10px] cursor-pointer"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    收起
                  </button>
                </div>
                <AIStreamingText text={aiExpanded} loading={aiExpandedLoading} />
                {!aiExpandedLoading && aiExpanded && (
                  <button
                    onClick={handleApplyAISuggestion}
                    className="mt-2 text-xs px-3 py-1 rounded-lg transition-colors cursor-pointer"
                    style={{ color: 'var(--color-primary)', background: 'rgba(198,123,92,0.1)', border: '1px solid rgba(198,123,92,0.2)' }}
                  >
                    应用到计划详情
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 快速统计 */}
      <div className="px-6 md:px-8 pb-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl p-4 text-center" style={{ backgroundColor: 'var(--color-bg-card)', border: 'var(--border-light)', boxShadow: 'var(--shadow-soft)' }}>
            <div className={`text-2xl font-bold ${colors.accent}`}>{plan.milestones?.length || 0}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>里程碑</div>
          </div>
          <div className="rounded-xl p-4 text-center" style={{ backgroundColor: 'var(--color-bg-card)', border: 'var(--border-light)', boxShadow: 'var(--shadow-soft)' }}>
            <div className={`text-2xl font-bold ${colors.accent}`}>{plan.timeline?.length || 0}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>时间线节点</div>
          </div>
          <div className="rounded-xl p-4 text-center" style={{ backgroundColor: 'var(--color-bg-card)', border: 'var(--border-light)', boxShadow: 'var(--shadow-soft)' }}>
            <div className={`text-2xl font-bold ${colors.accent}`}>{plan.obstacles?.length || 0}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>潜在障碍</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OdysseyPlanCard;
