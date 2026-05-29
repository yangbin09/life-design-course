import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Save, X, Target, AlertTriangle, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { getCardStyle, getTitleStyle, getDescStyle } from '../../styles/components';

const OdysseyCanvas = ({ plan, colors, addMilestone, addObstacle, onUpdate }) => {
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [showObstacleForm, setShowObstacleForm] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [editingObstacle, setEditingObstacle] = useState(null);
  const [expandedSections, setExpandedSections] = useState({ milestones: true, obstacles: true });

  const [newMilestone, setNewMilestone] = useState({
    title: '', description: '', timeframe: '1个月', priority: 'medium'
  });
  const [newObstacle, setNewObstacle] = useState({
    title: '', description: '', impact: 'medium', strategy: ''
  });

  const [editMilestoneData, setEditMilestoneData] = useState({});
  const [editObstacleData, setEditObstacleData] = useState({});

  if (!plan) return null;

  const milestones = plan.milestones || [];
  const obstacles = plan.obstacles || [];

  const priorityConfig = {
    low: { label: '低', color: 'var(--color-primary)' },
    medium: { label: '中', color: 'var(--color-accent)' },
    high: { label: '高', color: 'var(--color-error)' }
  };

  const impactConfig = {
    low: { label: '低影响', color: 'var(--color-primary)' },
    medium: { label: '中影响', color: 'var(--color-accent)' },
    high: { label: '高影响', color: 'var(--color-error)' }
  };

  const cardStyle = getCardStyle();
  const elevatedCardStyle = getCardStyle(true);
  const titleStyle = getTitleStyle('lg');
  const descStyle = getDescStyle();

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleAddMilestone = () => {
    if (!newMilestone.title.trim()) return;
    addMilestone(plan.id, newMilestone);
    setNewMilestone({ title: '', description: '', timeframe: '1个月', priority: 'medium' });
    setShowMilestoneForm(false);
  };

  const handleAddObstacle = () => {
    if (!newObstacle.title.trim()) return;
    addObstacle(plan.id, newObstacle);
    setNewObstacle({ title: '', description: '', impact: 'medium', strategy: '' });
    setShowObstacleForm(false);
  };

  return (
    <div className="space-y-6">
      {/* 画布标题 */}
      <div className={`${colors.bg} rounded-xl p-5 border ${colors.border}`}>
        <h4 style={titleStyle}>6个月详细规划画布</h4>
        <p style={descStyle}>设定关键里程碑、识别潜在障碍并制定应对策略</p>
      </div>

      {/* 两个面板：里程碑 + 障碍 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 里程碑面板 */}
        <div style={cardStyle} className="overflow-hidden">
          <div
            className="flex items-center justify-between px-5 py-4 border-b cursor-pointer transition-colors"
            style={{ borderColor: 'var(--border-light)', backgroundColor: 'transparent' }}
            onClick={() => toggleSection('milestones')}
          >
            <div className="flex items-center gap-2">
              <Target size={18} className={colors.accent} />
              <h5 style={{ ...titleStyle, fontSize: '1rem', marginBottom: 0 }}>关键里程碑</h5>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-muted)' }}>{milestones.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); setShowMilestoneForm(!showMilestoneForm); }}
                className="p-1.5 rounded-lg transition-colors"
                style={showMilestoneForm ? { backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-secondary)' } : {}}
              >
                <Plus size={16} />
              </button>
              {expandedSections.milestones ? <ChevronUp size={16} style={{ color: 'var(--color-text-muted)' }} /> : <ChevronDown size={16} style={{ color: 'var(--color-text-muted)' }} />}
            </div>
          </div>

          {/* 添加里程碑表单 */}
          {showMilestoneForm && (
            <div className={`p-5 border-b ${colors.bg}`} style={{ borderColor: 'var(--border-light)' }}>
              <div className="space-y-3">
                <input
                  type="text"
                  value={newMilestone.title}
                  onChange={(e) => setNewMilestone(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="里程碑标题"
                  className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2"
                  style={{ border: 'var(--border-light)', backgroundColor: 'var(--color-bg-card)', focusRingColor: 'var(--color-primary)' }}
                />
                <textarea
                  value={newMilestone.description}
                  onChange={(e) => setNewMilestone(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="详细描述这个里程碑..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 resize-none"
                  style={{ border: 'var(--border-light)', backgroundColor: 'var(--color-bg-card)' }}
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold mb-1" style={{ color: 'var(--color-text-muted)' }}>时间范围</label>
                    <select
                      value={newMilestone.timeframe}
                      onChange={(e) => setNewMilestone(prev => ({ ...prev, timeframe: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
                      style={{ border: 'var(--border-light)', backgroundColor: 'var(--color-bg-card)' }}
                    >
                      <option value="1周">1周</option>
                      <option value="2周">2周</option>
                      <option value="1个月">1个月</option>
                      <option value="2个月">2个月</option>
                      <option value="3个月">3个月</option>
                      <option value="6个月">6个月</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1" style={{ color: 'var(--color-text-muted)' }}>优先级</label>
                    <select
                      value={newMilestone.priority}
                      onChange={(e) => setNewMilestone(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
                      style={{ border: 'var(--border-light)', backgroundColor: 'var(--color-bg-card)' }}
                    >
                      <option value="low">低</option>
                      <option value="medium">中</option>
                      <option value="high">高</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowMilestoneForm(false)}
                    className="px-3 py-1.5 text-sm rounded-lg"
                    style={{ color: 'var(--color-text-muted)', border: 'var(--border-light)', backgroundColor: 'var(--color-bg-card)' }}
                  >
                    取消
                  </button>
                  <button
                    onClick={handleAddMilestone}
                    disabled={!newMilestone.title.trim()}
                    className="px-4 py-1.5 text-sm text-white rounded-lg transition-all"
                    style={newMilestone.title.trim()
                      ? { background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' }
                      : { backgroundColor: 'var(--color-bg-elevated)', cursor: 'not-allowed', color: 'var(--color-text-muted)' }}
                  >
                    添加
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 里程碑列表 */}
          {expandedSections.milestones && (
            <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
              {milestones.length === 0 ? (
                <div className="text-center py-8" style={{ color: 'var(--color-text-muted)' }}>
                  <Target size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">暂无里程碑</p>
                  <p className="text-xs mt-1">点击 + 添加你的第一个里程碑</p>
                </div>
              ) : (
                milestones.map((milestone, idx) => (
                  <div key={milestone.id} className="group rounded-lg p-4 transition-all" style={{ backgroundColor: 'var(--color-bg-elevated)', border: 'var(--border-light)' }}>
                    {editingMilestone === milestone.id ? (
                      /* 编辑模式 */
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editMilestoneData.title}
                          onChange={(e) => setEditMilestoneData(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full px-3 py-1.5 rounded-lg text-sm focus:outline-none"
                          style={{ border: 'var(--border-light)' }}
                        />
                        <textarea
                          value={editMilestoneData.description}
                          onChange={(e) => setEditMilestoneData(prev => ({ ...prev, description: e.target.value }))}
                          rows={2}
                          className="w-full px-3 py-1.5 rounded-lg text-sm focus:outline-none resize-none"
                          style={{ border: 'var(--border-light)' }}
                        />
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => setEditingMilestone(null)} className="px-3 py-1 text-xs rounded" style={{ color: 'var(--color-text-muted)', border: 'var(--border-light)' }}>取消</button>
                          <button
                            onClick={() => {
                              onUpdate({ milestones: milestones.map(m => m.id === milestone.id ? { ...m, ...editMilestoneData } : m) });
                              setEditingMilestone(null);
                            }}
                            className="flex items-center gap-1 px-3 py-1 text-xs text-white rounded"
                            style={{ backgroundColor: 'var(--color-primary)' }}
                          >
                            <Save size={12} /> 保存
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* 展示模式 */
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>#{idx + 1}</span>
                              <h6 className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>{milestone.title}</h6>
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold" style={{ backgroundColor: 'var(--color-bg-elevated)', color: priorityConfig[milestone.priority]?.color || 'var(--color-text-secondary)' }}>
                                {priorityConfig[milestone.priority]?.label || '中'}
                              </span>
                            </div>
                            {milestone.description && (
                              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{milestone.description}</p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--color-bg-card)', color: 'var(--color-text-muted)', border: 'var(--border-light)' }}>
                                {milestone.timeframe || '1个月'}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <button
                              onClick={() => {
                                setEditingMilestone(milestone.id);
                                setEditMilestoneData({ title: milestone.title, description: milestone.description, timeframe: milestone.timeframe, priority: milestone.priority });
                              }}
                              className="p-1.5 rounded"
                              style={{ color: 'var(--color-text-muted)' }}
                              onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-primary)'; e.currentTarget.style.backgroundColor = 'var(--color-bg-elevated)'; }}
                              onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                            >
                              <Edit3 size={12} />
                            </button>
                            <button
                              onClick={() => onUpdate({ milestones: milestones.filter(m => m.id !== milestone.id) })}
                              className="p-1.5 rounded"
                              style={{ color: 'var(--color-text-muted)' }}
                              onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-error)'; e.currentTarget.style.backgroundColor = 'var(--color-bg-elevated)'; }}
                              onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* 障碍与应对策略面板 */}
        <div style={cardStyle} className="overflow-hidden">
          <div
            className="flex items-center justify-between px-5 py-4 border-b cursor-pointer transition-colors"
            style={{ borderColor: 'var(--border-light)' }}
            onClick={() => toggleSection('obstacles')}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} style={{ color: 'var(--color-accent)' }} />
              <h5 style={{ ...titleStyle, fontSize: '1rem', marginBottom: 0 }}>潜在障碍与应对策略</h5>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-muted)' }}>{obstacles.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); setShowObstacleForm(!showObstacleForm); }}
                className="p-1.5 rounded-lg transition-colors"
                style={showObstacleForm ? { backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-secondary)' } : { backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-accent)' }}
              >
                <Plus size={16} />
              </button>
              {expandedSections.obstacles ? <ChevronUp size={16} style={{ color: 'var(--color-text-muted)' }} /> : <ChevronDown size={16} style={{ color: 'var(--color-text-muted)' }} />}
            </div>
          </div>

          {/* 添加障碍表单 */}
          {showObstacleForm && (
            <div className="p-5 border-b" style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--color-bg)' }}>
              <div className="space-y-3">
                <input
                  type="text"
                  value={newObstacle.title}
                  onChange={(e) => setNewObstacle(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="障碍名称"
                  className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2"
                  style={{ border: 'var(--border-light)', backgroundColor: 'var(--color-bg-card)' }}
                />
                <textarea
                  value={newObstacle.description}
                  onChange={(e) => setNewObstacle(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="描述这个障碍..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 resize-none"
                  style={{ border: 'var(--border-light)', backgroundColor: 'var(--color-bg-card)' }}
                />
                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: 'var(--color-text-muted)' }}>影响程度</label>
                  <select
                    value={newObstacle.impact}
                    onChange={(e) => setNewObstacle(prev => ({ ...prev, impact: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
                    style={{ border: 'var(--border-light)', backgroundColor: 'var(--color-bg-card)' }}
                  >
                    <option value="low">低影响</option>
                    <option value="medium">中影响</option>
                    <option value="high">高影响</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: 'var(--color-text-muted)' }}>
                    <Shield size={12} className="inline mr-1" />
                    应对策略
                  </label>
                  <textarea
                    value={newObstacle.strategy}
                    onChange={(e) => setNewObstacle(prev => ({ ...prev, strategy: e.target.value }))}
                    placeholder="你打算如何应对这个障碍？"
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 resize-none"
                    style={{ border: 'var(--border-light)', backgroundColor: 'var(--color-bg-card)' }}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowObstacleForm(false)}
                    className="px-3 py-1.5 text-sm rounded-lg"
                    style={{ color: 'var(--color-text-muted)', border: 'var(--border-light)', backgroundColor: 'var(--color-bg-card)' }}
                  >
                    取消
                  </button>
                  <button
                    onClick={handleAddObstacle}
                    disabled={!newObstacle.title.trim()}
                    className="px-4 py-1.5 text-sm text-white rounded-lg transition-all"
                    style={newObstacle.title.trim()
                      ? { background: 'linear-gradient(135deg, var(--color-accent), var(--color-primary))' }
                      : { backgroundColor: 'var(--color-bg-elevated)', cursor: 'not-allowed', color: 'var(--color-text-muted)' }}
                  >
                    添加
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 障碍列表 */}
          {expandedSections.obstacles && (
            <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
              {obstacles.length === 0 ? (
                <div className="text-center py-8" style={{ color: 'var(--color-text-muted)' }}>
                  <Shield size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">暂无障碍记录</p>
                  <p className="text-xs mt-1">点击 + 识别并记录潜在障碍</p>
                </div>
              ) : (
                obstacles.map((obstacle, idx) => (
                  <div key={obstacle.id} className="group rounded-lg p-4 transition-all" style={{ backgroundColor: 'var(--color-bg)', border: 'var(--border-warm)' }}>
                    {editingObstacle === obstacle.id ? (
                      /* 编辑模式 */
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editObstacleData.title}
                          onChange={(e) => setEditObstacleData(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full px-3 py-1.5 rounded-lg text-sm focus:outline-none"
                          style={{ border: 'var(--border-light)' }}
                        />
                        <textarea
                          value={editObstacleData.description}
                          onChange={(e) => setEditObstacleData(prev => ({ ...prev, description: e.target.value }))}
                          rows={2}
                          className="w-full px-3 py-1.5 rounded-lg text-sm focus:outline-none resize-none"
                          style={{ border: 'var(--border-light)' }}
                        />
                        <select
                          value={editObstacleData.impact}
                          onChange={(e) => setEditObstacleData(prev => ({ ...prev, impact: e.target.value }))}
                          className="w-full px-3 py-1.5 rounded-lg text-sm focus:outline-none"
                          style={{ border: 'var(--border-light)' }}
                        >
                          <option value="low">低影响</option>
                          <option value="medium">中影响</option>
                          <option value="high">高影响</option>
                        </select>
                        <textarea
                          value={editObstacleData.strategy}
                          onChange={(e) => setEditObstacleData(prev => ({ ...prev, strategy: e.target.value }))}
                          rows={2}
                          placeholder="应对策略"
                          className="w-full px-3 py-1.5 rounded-lg text-sm focus:outline-none resize-none"
                          style={{ border: 'var(--border-light)' }}
                        />
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => setEditingObstacle(null)} className="px-3 py-1 text-xs rounded" style={{ color: 'var(--color-text-muted)', border: 'var(--border-light)' }}>取消</button>
                          <button
                            onClick={() => {
                              onUpdate({ obstacles: obstacles.map(o => o.id === obstacle.id ? { ...o, ...editObstacleData } : o) });
                              setEditingObstacle(null);
                            }}
                            className="flex items-center gap-1 px-3 py-1 text-xs text-white rounded"
                            style={{ backgroundColor: 'var(--color-primary)' }}
                          >
                            <Save size={12} /> 保存
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* 展示模式 */
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <AlertTriangle size={14} style={{ color: 'var(--color-accent)' }} className="shrink-0" />
                              <h6 className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>{obstacle.title}</h6>
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold" style={{ backgroundColor: 'var(--color-bg-elevated)', color: impactConfig[obstacle.impact]?.color || 'var(--color-text-secondary)' }}>
                                {impactConfig[obstacle.impact]?.label || '中影响'}
                              </span>
                            </div>
                            {obstacle.description && (
                              <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--color-text-muted)' }}>{obstacle.description}</p>
                            )}
                            {obstacle.strategy && (
                              <div className="rounded-md p-2.5 mt-2" style={{ backgroundColor: 'var(--color-bg-card)', border: 'var(--border-warm)' }}>
                                <div className="flex items-center gap-1 mb-1">
                                  <Shield size={11} style={{ color: 'var(--color-primary)' }} />
                                  <span className="text-[10px] font-bold uppercase" style={{ color: 'var(--color-primary)' }}>应对策略</span>
                                </div>
                                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{obstacle.strategy}</p>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <button
                              onClick={() => {
                                setEditingObstacle(obstacle.id);
                                setEditObstacleData({
                                  title: obstacle.title,
                                  description: obstacle.description,
                                  impact: obstacle.impact,
                                  strategy: obstacle.strategy
                                });
                              }}
                              className="p-1.5 rounded"
                              style={{ color: 'var(--color-text-muted)' }}
                              onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-primary)'; e.currentTarget.style.backgroundColor = 'var(--color-bg-elevated)'; }}
                              onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                            >
                              <Edit3 size={12} />
                            </button>
                            <button
                              onClick={() => onUpdate({ obstacles: obstacles.filter(o => o.id !== obstacle.id) })}
                              className="p-1.5 rounded"
                              style={{ color: 'var(--color-text-muted)' }}
                              onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-error)'; e.currentTarget.style.backgroundColor = 'var(--color-bg-elevated)'; }}
                              onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* 画布总结 */}
      <div className="rounded-xl p-5" style={elevatedCardStyle}>
        <h5 style={{ ...titleStyle, fontSize: '1rem', marginBottom: '0.75rem' }}>画布概览</h5>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-lg p-3 text-center" style={{ backgroundColor: 'var(--color-bg-card)', border: 'var(--border-light)' }}>
            <div className={`text-xl font-bold ${colors.accent}`}>{milestones.length}</div>
            <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>里程碑</div>
          </div>
          <div className="rounded-lg p-3 text-center" style={{ backgroundColor: 'var(--color-bg-card)', border: 'var(--border-light)' }}>
            <div className="text-xl font-bold" style={{ color: 'var(--color-accent)' }}>{obstacles.length}</div>
            <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>障碍</div>
          </div>
          <div className="rounded-lg p-3 text-center" style={{ backgroundColor: 'var(--color-bg-card)', border: 'var(--border-light)' }}>
            <div className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
              {milestones.filter(m => m.priority === 'high').length}
            </div>
            <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>高优先级</div>
          </div>
          <div className="rounded-lg p-3 text-center" style={{ backgroundColor: 'var(--color-bg-card)', border: 'var(--border-light)' }}>
            <div className="text-xl font-bold" style={{ color: 'var(--color-error)' }}>
              {obstacles.filter(o => o.impact === 'high').length}
            </div>
            <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>高影响障碍</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OdysseyCanvas;
