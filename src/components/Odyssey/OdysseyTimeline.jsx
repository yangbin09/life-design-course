import React, { useState } from 'react';
import { Plus, Edit3, Trash2, RotateCcw, Save, X, ChevronDown, ChevronUp, Sparkles, Loader2 } from 'lucide-react';
import { getCardStyle, getTitleStyle, getDescStyle } from '../../styles/components';
import useAI from '../../hooks/useAI';
import AIButton from '../AI/AIButton';
import AIStreamingText from '../AI/AIStreamingText';
import { ODYSSEY_TIMELINE_NEXT_PROMPT } from '../../data/aiPrompts';

const OdysseyTimeline = ({ plan, planIndex, timeline, colors, onAddNode, onUpdateNode, onRemoveNode, onReset, stats }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [newNode, setNewNode] = useState({ year: 1, label: '', description: '' });
  const [editData, setEditData] = useState({});
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [aiSuggestionLoading, setAiSuggestionLoading] = useState(false);
  const [showAiSuggestion, setShowAiSuggestion] = useState(false);
  const { generateStreamingWithTemplate, isConfigured } = useAI();

  const planColors = ['blue', 'purple', 'orange'];

  const handleAddNode = () => {
    if (!newNode.label.trim()) return;
    onAddNode(newNode);
    setNewNode({ year: 1, label: '', description: '' });
    setShowAddForm(false);
  };

  const handleUpdateNode = (nodeId) => {
    onUpdateNode(nodeId, editData);
    setEditingId(null);
    setEditData({});
  };

  const startEdit = (node) => {
    setEditingId(node.id);
    setEditData({ year: node.year, label: node.label, description: node.description });
  };

  const toggleExpand = (nodeId) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  };

  const handleAISuggestNext = async () => {
    if (!isConfigured || aiSuggestionLoading || !plan) return;
    setAiSuggestionLoading(true);
    setAiSuggestion('');
    setShowAiSuggestion(true);
    try {
      const timelineNodes = timeline.map(n => `Y${n.year}: ${n.label}${n.description ? ` - ${n.description}` : ''}`).join('\n');
      const text = await generateStreamingWithTemplate(ODYSSEY_TIMELINE_NEXT_PROMPT, {
        title: plan.title || '',
        description: plan.desc || '',
        timelineNodes: timelineNodes || '（暂无节点）',
      });
      setAiSuggestion(text);
    } catch (err) {
      setAiSuggestion(`分析失败: ${err.message}`);
    } finally {
      setAiSuggestionLoading(false);
    }
  };

  if (!plan) return null;

  const cardStyle = getCardStyle();
  const titleStyle = getTitleStyle('lg');
  const descStyle = getDescStyle();

  return (
    <div className="space-y-6">
      {/* 工具栏 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 style={titleStyle}>5年发展路径</h4>
          <p style={descStyle}>
            共 {stats.totalNodes} 个节点，其中 {stats.customNodes} 个自定义
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={showAddForm
              ? { backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-secondary)' }
              : { background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', color: 'white' }}
          >
            <Plus size={16} />
            添加节点
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all"
            style={{ color: 'var(--color-text-muted)', backgroundColor: 'var(--color-bg-card)', border: 'var(--border-light)' }}
          >
            <RotateCcw size={14} />
            重置
          </button>
        </div>
      </div>

      {/* 添加节点表单 */}
      {showAddForm && (
        <div style={cardStyle} className="p-5 space-y-4">
          <h5 style={{ ...titleStyle, fontSize: '1rem', marginBottom: 0 }}>新增时间线节点</h5>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: 'var(--color-text-muted)' }}>年份</label>
              <select
                value={newNode.year}
                onChange={(e) => setNewNode(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2"
                style={{ border: 'var(--border-light)' }}
              >
                {[1, 2, 3, 4, 5].map(y => (
                  <option key={y} value={y}>第 {y} 年</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold mb-1" style={{ color: 'var(--color-text-muted)' }}>节点标签</label>
              <input
                type="text"
                value={newNode.label}
                onChange={(e) => setNewNode(prev => ({ ...prev, label: e.target.value }))}
                placeholder="例如：转行学习编程"
                className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2"
                style={{ border: 'var(--border-light)' }}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold mb-1" style={{ color: 'var(--color-text-muted)' }}>详细描述</label>
            <textarea
              value={newNode.description}
              onChange={(e) => setNewNode(prev => ({ ...prev, description: e.target.value }))}
              placeholder="描述这个阶段的具体计划..."
              rows={2}
              className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 resize-none"
              style={{ border: 'var(--border-light)' }}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-sm rounded-lg"
              style={{ color: 'var(--color-text-muted)', border: 'var(--border-light)' }}
            >
              取消
            </button>
            <button
              onClick={handleAddNode}
              disabled={!newNode.label.trim()}
              className="px-4 py-2 text-sm text-white rounded-lg transition-all"
              style={newNode.label.trim()
                ? { background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' }
                : { backgroundColor: 'var(--color-bg-elevated)', cursor: 'not-allowed', color: 'var(--color-text-muted)' }}
            >
              添加
            </button>
          </div>
        </div>
      )}

      {/* 时间线可视化 */}
      <div className="relative">
        {/* 时间轴主线 */}
        <div className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5" style={{ backgroundColor: 'var(--border-light)' }}></div>

        {/* 节点列表 */}
        <div className="space-y-0">
          {timeline.map((node, idx) => {
            const isExpanded = expandedNodes.has(node.id);
            const isEditing = editingId === node.id;

            return (
              <div key={node.id} className="relative pl-16 md:pl-20 pb-6 group">
                {/* 节点圆点 */}
                <div className="absolute left-4 md:left-6 top-1 w-4 h-4 rounded-full border-2 shadow-md z-10"
                  style={{ borderColor: 'white', backgroundColor: node.isDefault ? 'var(--color-primary)' : 'var(--color-text-secondary)' }}>
                </div>

                {/* 年份标签 */}
                <div className="absolute left-0 top-0 text-xs font-bold pr-2" style={{ color: 'var(--color-primary)', backgroundColor: 'var(--color-bg-card)' }}>
                  Y{node.year}
                </div>

                {/* 节点卡片 */}
                <div style={cardStyle} className={`hover:shadow-md transition-all ${isEditing ? `ring-2` : ''}`}>

                  {isEditing ? (
                    /* 编辑模式 */
                    <div className="p-4 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-bold mb-1" style={{ color: 'var(--color-text-muted)' }}>年份</label>
                          <select
                            value={editData.year}
                            onChange={(e) => setEditData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                            className="w-full px-3 py-1.5 rounded-lg text-sm focus:outline-none"
                            style={{ border: 'var(--border-light)' }}
                          >
                            {[1, 2, 3, 4, 5].map(y => (
                              <option key={y} value={y}>第 {y} 年</option>
                            ))}
                          </select>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold mb-1" style={{ color: 'var(--color-text-muted)' }}>标签</label>
                          <input
                            type="text"
                            value={editData.label}
                            onChange={(e) => setEditData(prev => ({ ...prev, label: e.target.value }))}
                            className="w-full px-3 py-1.5 rounded-lg text-sm focus:outline-none"
                            style={{ border: 'var(--border-light)' }}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-1" style={{ color: 'var(--color-text-muted)' }}>描述</label>
                        <textarea
                          value={editData.description}
                          onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                          rows={2}
                          className="w-full px-3 py-1.5 rounded-lg text-sm focus:outline-none resize-none"
                          style={{ border: 'var(--border-light)' }}
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1.5 text-xs rounded-lg"
                          style={{ color: 'var(--color-text-muted)', border: 'var(--border-light)' }}
                        >
                          取消
                        </button>
                        <button
                          onClick={() => handleUpdateNode(node.id)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs text-white rounded-lg"
                          style={{ backgroundColor: 'var(--color-primary)' }}
                        >
                          <Save size={12} />
                          保存
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* 展示模式 */
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold" style={{ color: 'var(--color-text)' }}>{node.label}</span>
                            {!node.isDefault && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-muted)' }}>自定义</span>
                            )}
                          </div>
                          {node.description && (
                            <p className={`text-sm leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}
                              style={{ color: 'var(--color-text-secondary)' }}>
                              {node.description}
                            </p>
                          )}
                          {node.description && node.description.length > 80 && (
                            <button
                              onClick={() => toggleExpand(node.id)}
                              className="text-xs mt-1 flex items-center gap-0.5"
                              style={{ color: 'var(--color-text-muted)' }}
                            >
                              {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                              {isExpanded ? '收起' : '展开'}
                            </button>
                          )}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button
                            onClick={() => startEdit(node)}
                            className="p-1.5 rounded transition-colors"
                            style={{ color: 'var(--color-text-muted)' }}
                            onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-primary)'; e.currentTarget.style.backgroundColor = 'var(--color-bg-elevated)'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => onRemoveNode(node.id)}
                            className="p-1.5 rounded transition-colors"
                            style={{ color: 'var(--color-text-muted)' }}
                            onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-error)'; e.currentTarget.style.backgroundColor = 'var(--color-bg-elevated)'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 空状态 */}
        {timeline.length === 0 && (
          <div className="text-center py-16" style={{ color: 'var(--color-text-muted)' }}>
            <div className="text-4xl mb-3"> </div>
            <p className="font-medium">时间线为空</p>
            <p className="text-sm mt-1">点击上方"添加节点"开始规划</p>
          </div>
        )}
      </div>

      {/* AI 建议下一步 */}
      {isConfigured && timeline.length > 0 && (
        <div style={cardStyle} className="p-5">
          {!showAiSuggestion && !aiSuggestionLoading && (
            <div className="text-center">
              <AIButton onClick={handleAISuggestNext} loading={aiSuggestionLoading} size="md">
                AI 建议下一步
              </AIButton>
              <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
                基于已有时间线节点，AI 分析最合适的下一步里程碑
              </p>
            </div>
          )}
          {(showAiSuggestion || aiSuggestionLoading) && (
            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <Sparkles size={14} style={{ color: 'var(--color-primary)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>AI 下一步建议</span>
                <button
                  onClick={() => { setShowAiSuggestion(false); setAiSuggestion(''); }}
                  className="ml-auto text-[10px] cursor-pointer"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  收起
                </button>
              </div>
              <AIStreamingText text={aiSuggestion} loading={aiSuggestionLoading} />
              {!aiSuggestionLoading && aiSuggestion && (
                <button
                  onClick={() => {
                    setShowAiSuggestion(false);
                    setAiSuggestion('');
                    setShowAddForm(true);
                  }}
                  className="mt-3 text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  style={{ color: 'var(--color-primary)', background: 'rgba(198,123,92,0.1)', border: '1px solid rgba(198,123,92,0.2)' }}
                >
                  去添加节点
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OdysseyTimeline;
