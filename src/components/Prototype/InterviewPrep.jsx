import React, { useState } from 'react';
import { Users, Plus, Trash2, CheckCircle, Clock, Edit3, Save, X, Wand2 } from 'lucide-react';
import { getCardStyle, getTitleStyle, getDescStyle, getButtonStyle } from '../../styles/components';
import useAI from '../../hooks/useAI';
import AIStreamingText from '../AI/AIStreamingText';
import { INTERVIEW_QUESTIONS_PROMPT } from '../../data/aiPrompts';

const DEFAULT_QUESTIONS = [
  '你典型的一天是怎么度过的？',
  '你最喜欢这份工作的哪个部分？',
  '你最不喜欢或最惊讶的是什么？',
  '你是如何进入这个领域的？',
  '如果重新选择，你还会做这个吗？',
];

const InterviewPrep = ({ interviews, onAdd, onUpdate, onRemove }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    person: '',
    role: '',
    topic: '',
    questions: [...DEFAULT_QUESTIONS],
    notes: '',
    scheduledDate: '',
  });
  const [newQuestion, setNewQuestion] = useState('');
  const [aiQuestionsText, setAiQuestionsText] = useState('');
  const { loading: aiLoading, streamingText, generateStreamingWithTemplate } = useAI();

  const handleGenerateQuestions = async () => {
    if (!form.topic.trim() && !form.role.trim()) return;
    setAiQuestionsText('');
    try {
      const text = await generateStreamingWithTemplate(INTERVIEW_QUESTIONS_PROMPT, {
        role: form.role || '未知',
        topic: form.topic || '职业探索',
      });
      setAiQuestionsText(text);
      // 解析生成的问题并添加到列表
      const questions = text.split('\n').filter(line => line.trim()).map(line => line.replace(/^\d+[\.\、\)]\s*/, '').trim()).filter(q => q.length > 0);
      if (questions.length > 0) {
        setForm(prev => ({ ...prev, questions: [...prev.questions, ...questions] }));
      }
    } catch (err) {
      setAiQuestionsText('AI 生成失败: ' + err.message);
    }
  };

  const resetForm = () => {
    setForm({
      person: '',
      role: '',
      topic: '',
      questions: [...DEFAULT_QUESTIONS],
      notes: '',
      scheduledDate: '',
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleAdd = () => {
    if (!form.person.trim()) return;
    if (editingId) {
      onUpdate(editingId, form);
    } else {
      onAdd(form);
    }
    resetForm();
  };

  const handleEdit = (interview) => {
    setForm({
      person: interview.person,
      role: interview.role,
      topic: interview.topic,
      questions: [...interview.questions],
      notes: interview.notes,
      scheduledDate: interview.scheduledDate,
    });
    setEditingId(interview.id);
    setShowForm(true);
  };

  const addQuestion = () => {
    if (!newQuestion.trim()) return;
    setForm(prev => ({ ...prev, questions: [...prev.questions, newQuestion] }));
    setNewQuestion('');
  };

  const removeQuestion = (idx) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== idx),
    }));
  };

  const toggleStatus = (interview) => {
    onUpdate(interview.id, {
      status: interview.status === 'planned' ? 'completed' : 'planned',
    });
  };

  const cardStyle = getCardStyle();
  const titleStyle = getTitleStyle('lg');
  const descStyle = getDescStyle();
  const primaryBtnStyle = getButtonStyle('primary');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-3" style={{ backgroundColor: 'var(--color-bg-elevated)' }}>
          <Users style={{ color: 'var(--color-accent)' }} size={28} />
        </div>
        <h3 style={{ ...titleStyle, fontSize: '1.25rem', marginBottom: '0.25rem' }}>人生设计访谈准备</h3>
        <p style={descStyle}>
          找到已经在做那个工作的人，请他喝杯咖啡，听听故事
        </p>
      </div>

      {/* 添加按钮 */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors"
          style={{ border: '2px dashed var(--border-warm)', color: 'var(--color-accent)' }}
        >
          <Plus size={16} /> 准备一次访谈
        </button>
      )}

      {/* 表单 */}
      {showForm && (
        <div style={cardStyle} className="p-5 space-y-4">
          <h4 className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
            {editingId ? '编辑访谈' : '新建访谈'}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold block mb-1" style={{ color: 'var(--color-text-secondary)' }}>访谈对象</label>
              <input
                type="text"
                value={form.person}
                onChange={(e) => setForm(prev => ({ ...prev, person: e.target.value }))}
                placeholder="姓名"
                className="w-full p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2"
                style={{ border: 'var(--border-light)', backgroundColor: 'var(--color-bg-card)' }}
              />
            </div>
            <div>
              <label className="text-xs font-bold block mb-1" style={{ color: 'var(--color-text-secondary)' }}>对方角色/职业</label>
              <input
                type="text"
                value={form.role}
                onChange={(e) => setForm(prev => ({ ...prev, role: e.target.value }))}
                placeholder="例如：产品经理"
                className="w-full p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2"
                style={{ border: 'var(--border-light)', backgroundColor: 'var(--color-bg-card)' }}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold block mb-1" style={{ color: 'var(--color-text-secondary)' }}>访谈主题</label>
            <input
              type="text"
              value={form.topic}
              onChange={(e) => setForm(prev => ({ ...prev, topic: e.target.value }))}
              placeholder="你想了解什么"
              className="w-full p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2"
              style={{ border: 'var(--border-light)', backgroundColor: 'var(--color-bg-card)' }}
            />
          </div>

          <div>
            <label className="text-xs font-bold block mb-1" style={{ color: 'var(--color-text-secondary)' }}>计划日期</label>
            <input
              type="date"
              value={form.scheduledDate}
              onChange={(e) => setForm(prev => ({ ...prev, scheduledDate: e.target.value }))}
              className="w-full p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2"
              style={{ border: 'var(--border-light)', backgroundColor: 'var(--color-bg-card)' }}
            />
          </div>

          {/* AI 生成问题 */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateQuestions}
              disabled={aiLoading || (!form.topic.trim() && !form.role.trim())}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              style={aiLoading || (!form.topic.trim() && !form.role.trim())
                ? { backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-muted)', cursor: 'not-allowed' }
                : { backgroundColor: 'var(--color-accent)', color: 'white' }
              }
            >
              <Wand2 size={12} /> {aiLoading ? 'AI 生成中...' : 'AI 生成问题'}
            </button>
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              先填写角色和主题，AI 自动生成 10 个问题
            </span>
          </div>
          {(streamingText && !aiQuestionsText) && (
            <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--color-bg)', border: 'var(--border-light)' }}>
              <AIStreamingText text={streamingText} loading={aiLoading} />
            </div>
          )}

          {/* 问题列表 */}
          <div>
            <label className="text-xs font-bold block mb-2" style={{ color: 'var(--color-text-secondary)' }}>访谈问题</label>
            <div className="space-y-2 mb-3">
              {form.questions.map((q, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: 'var(--color-bg)' }}>
                  <span className="text-xs font-bold w-5" style={{ color: 'var(--color-accent)' }}>{idx + 1}</span>
                  <span className="flex-1 text-sm" style={{ color: 'var(--color-text)' }}>{q}</span>
                  <button onClick={() => removeQuestion(idx)} style={{ color: 'var(--color-text-muted)' }}>
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addQuestion()}
                placeholder="添加自定义问题"
                className="flex-1 p-2 rounded-lg text-sm focus:outline-none focus:ring-2"
                style={{ border: 'var(--border-light)', backgroundColor: 'var(--color-bg-card)' }}
              />
              <button
                onClick={addQuestion}
                className="px-3 rounded-lg text-sm"
                style={{ backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-accent)' }}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold block mb-1" style={{ color: 'var(--color-text-secondary)' }}>备注</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="其他准备工作..."
              className="w-full p-2.5 rounded-lg text-sm resize-none focus:outline-none focus:ring-2"
              style={{ border: 'var(--border-light)', backgroundColor: 'var(--color-bg-card)' }}
              rows={2}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button onClick={resetForm} className="text-xs px-3 py-1.5" style={{ color: 'var(--color-text-muted)' }}>取消</button>
            <button
              onClick={handleAdd}
              disabled={!form.person.trim()}
              className="text-xs px-4 py-1.5 rounded-lg transition-colors"
              style={form.person.trim()
                ? { ...primaryBtnStyle, borderRadius: 'var(--radius-md)' }
                : { backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-muted)', cursor: 'not-allowed', borderRadius: 'var(--radius-md)' }}
            >
              {editingId ? '保存修改' : '添加访谈'}
            </button>
          </div>
        </div>
      )}

      {/* 访谈列表 */}
      {interviews.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>访谈计划 ({interviews.length})</h4>
          {interviews.map((item) => (
            <div key={item.id} style={cardStyle} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>{item.person}</h5>
                    {item.role && <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>({item.role})</span>}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={
                      item.status === 'completed'
                        ? { backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-primary)' }
                        : { backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-accent)' }
                    }>
                      {item.status === 'completed' ? '已完成' : '计划中'}
                    </span>
                  </div>
                  {item.topic && <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{item.topic}</p>}
                  {item.scheduledDate && (
                    <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: 'var(--color-text-muted)' }}>
                      <Clock size={10} /> {item.scheduledDate}
                    </p>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => toggleStatus(item)}
                    className="p-1.5 transition-colors"
                    style={{ color: 'var(--color-text-muted)' }}
                    title={item.status === 'completed' ? '标记为计划中' : '标记为已完成'}
                  >
                    <CheckCircle size={16} />
                  </button>
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-1.5 transition-colors"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="p-1.5 transition-colors"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {item.questions.length > 0 && (
                <div className="mt-2">
                  <p className="text-[10px] font-bold uppercase mb-1" style={{ color: 'var(--color-text-muted)' }}>准备的问题</p>
                  <ul className="space-y-0.5">
                    {item.questions.slice(0, 3).map((q, i) => (
                      <li key={i} className="text-xs flex gap-1" style={{ color: 'var(--color-text-secondary)' }}>
                        <span style={{ color: 'var(--color-text-muted)' }}>{i + 1}.</span> {q}
                      </li>
                    ))}
                    {item.questions.length > 3 && (
                      <li className="text-xs" style={{ color: 'var(--color-text-muted)' }}>+{item.questions.length - 3} 个问题</li>
                    )}
                  </ul>
                </div>
              )}

              {item.notes && (
                <p className="text-xs mt-2 p-2 rounded" style={{ color: 'var(--color-text-muted)', backgroundColor: 'var(--color-bg-elevated)' }}>{item.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {interviews.length === 0 && !showForm && (
        <div className="text-center py-8" style={{ color: 'var(--color-text-muted)' }}>
          <Users size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">还没有访谈计划</p>
          <p className="text-xs mt-1">找到在做你想做的事的人，听听他们的故事</p>
        </div>
      )}
    </div>
  );
};

export default InterviewPrep;
