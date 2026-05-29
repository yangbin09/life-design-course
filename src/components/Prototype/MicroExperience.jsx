import React, { useState } from 'react';
import { Beaker, Plus, Trash2, Edit3, CheckCircle, Clock, PlayCircle, X } from 'lucide-react';
import { getCardStyle, getTitleStyle, getDescStyle, getButtonStyle } from '../../styles/components';

const COST_OPTIONS = ['低', '中', '高'];
const STATUS_CONFIG = {
  planned: { label: '计划中', color: { backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-primary)' }, icon: <Clock size={12} /> },
  'in-progress': { label: '进行中', color: { backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-accent)' }, icon: <PlayCircle size={12} /> },
  completed: { label: '已完成', color: { backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-primary)' }, icon: <CheckCircle size={12} /> },
};

const MicroExperience = ({ experiences, onAdd, onUpdate, onRemove }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    goal: '',
    duration: '',
    cost: '低',
  });
  const [expandedId, setExpandedId] = useState(null);

  const resetForm = () => {
    setForm({ title: '', description: '', goal: '', duration: '', cost: '低' });
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

  const handleEdit = (exp) => {
    setForm({
      title: exp.title,
      description: exp.description,
      goal: exp.goal,
      duration: exp.duration,
      cost: exp.cost,
    });
    setEditingId(exp.id);
    setShowForm(true);
  };

  const cycleStatus = (exp) => {
    const order = ['planned', 'in-progress', 'completed'];
    const current = order.indexOf(exp.status);
    const next = order[(current + 1) % order.length];
    onUpdate(exp.id, { status: next });
  };

  const cardStyle = getCardStyle();
  const titleStyle = getTitleStyle('lg');
  const descStyle = getDescStyle();
  const primaryBtnStyle = getButtonStyle('primary');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-3" style={{ backgroundColor: 'var(--color-bg-elevated)' }}>
          <Beaker style={{ color: 'var(--color-primary)' }} size={28} />
        </div>
        <h3 style={{ ...titleStyle, fontSize: '1.25rem', marginBottom: '0.25rem' }}>微体验规划器</h3>
        <p style={descStyle}>
          想开餐厅？先去后厨帮工两周。以最低成本试错体验。
        </p>
      </div>

      {/* 添加按钮 */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors"
          style={{ border: '2px dashed var(--border-warm)', color: 'var(--color-primary)' }}
        >
          <Plus size={16} /> 规划一个微体验
        </button>
      )}

      {/* 表单 */}
      {showForm && (
        <div style={cardStyle} className="p-5 space-y-4">
          <h4 className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
            {editingId ? '编辑微体验' : '新建微体验'}
          </h4>

          <div>
            <label className="text-xs font-bold block mb-1" style={{ color: 'var(--color-text-secondary)' }}>体验名称</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
              placeholder="例如：在咖啡店做一周兼职"
              className="w-full p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2"
              style={{ border: 'var(--border-light)', backgroundColor: 'var(--color-bg-card)' }}
            />
          </div>

          <div>
            <label className="text-xs font-bold block mb-1" style={{ color: 'var(--color-text-secondary)' }}>具体描述</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="你打算怎么做这个体验？"
              className="w-full p-2.5 rounded-lg text-sm resize-none focus:outline-none focus:ring-2"
              style={{ border: 'var(--border-light)', backgroundColor: 'var(--color-bg-card)' }}
              rows={2}
            />
          </div>

          <div>
            <label className="text-xs font-bold block mb-1" style={{ color: 'var(--color-text-secondary)' }}>体验目标</label>
            <input
              type="text"
              value={form.goal}
              onChange={(e) => setForm(prev => ({ ...prev, goal: e.target.value }))}
              placeholder="你想通过这个体验验证什么？"
              className="w-full p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2"
              style={{ border: 'var(--border-light)', backgroundColor: 'var(--color-bg-card)' }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold block mb-1" style={{ color: 'var(--color-text-secondary)' }}>时长</label>
              <input
                type="text"
                value={form.duration}
                onChange={(e) => setForm(prev => ({ ...prev, duration: e.target.value }))}
                placeholder="例如：2周"
                className="w-full p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2"
                style={{ border: 'var(--border-light)', backgroundColor: 'var(--color-bg-card)' }}
              />
            </div>
            <div>
              <label className="text-xs font-bold block mb-1" style={{ color: 'var(--color-text-secondary)' }}>成本</label>
              <div className="flex gap-2">
                {COST_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setForm(prev => ({ ...prev, cost: opt }))}
                    className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
                    style={form.cost === opt
                      ? { backgroundColor: 'var(--color-primary)', color: 'white' }
                      : { backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-secondary)' }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
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
              {editingId ? '保存修改' : '添加体验'}
            </button>
          </div>
        </div>
      )}

      {/* 体验列表 */}
      {experiences.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>微体验计划 ({experiences.length})</h4>
          {experiences.map((exp) => {
            const isExpanded = expandedId === exp.id;
            const status = STATUS_CONFIG[exp.status];

            return (
              <div key={exp.id} style={cardStyle} className="overflow-hidden">
                <div
                  className="p-4 cursor-pointer transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>{exp.title}</h5>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1" style={status.color}>
                          {status.icon} {status.label}
                        </span>
                      </div>
                      <div className="flex gap-3 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        {exp.duration && <span>时长: {exp.duration}</span>}
                        <span>成本: {exp.cost}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); cycleStatus(exp); }}
                        className="p-1.5 transition-colors"
                        style={{ color: 'var(--color-text-muted)' }}
                        title="切换状态"
                      >
                        <CheckCircle size={14} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleEdit(exp); }}
                        className="p-1.5 transition-colors"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onRemove(exp.id); }}
                        className="p-1.5 transition-colors"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-3 space-y-2" style={{ borderTop: 'var(--border-light)' }}>
                    {exp.description && (
                      <div>
                        <span className="text-[10px] font-bold uppercase" style={{ color: 'var(--color-text-muted)' }}>描述</span>
                        <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>{exp.description}</p>
                      </div>
                    )}
                    {exp.goal && (
                      <div>
                        <span className="text-[10px] font-bold uppercase" style={{ color: 'var(--color-text-muted)' }}>目标</span>
                        <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>{exp.goal}</p>
                      </div>
                    )}
                    {exp.status === 'completed' && (
                      <div>
                        <span className="text-[10px] font-bold uppercase" style={{ color: 'var(--color-primary)' }}>学到了什么？</span>
                        <textarea
                          value={exp.learnings || ''}
                          onChange={(e) => onUpdate(exp.id, { learnings: e.target.value })}
                          placeholder="记录你从这个微体验中学到了什么..."
                          className="w-full mt-1 p-2 rounded-lg text-sm resize-none focus:outline-none focus:ring-2"
                          style={{ border: 'var(--border-warm)', backgroundColor: 'var(--color-bg)' }}
                          rows={2}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {experiences.length === 0 && !showForm && (
        <div className="text-center py-8" style={{ color: 'var(--color-text-muted)' }}>
          <Beaker size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">还没有微体验计划</p>
          <p className="text-xs mt-1">用最低成本试错，验证你的想法</p>
        </div>
      )}
    </div>
  );
};

export default MicroExperience;
