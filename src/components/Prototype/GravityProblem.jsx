import React, { useState } from 'react';
import { Anchor, HelpCircle, CheckCircle, XCircle, RotateCcw, ChevronRight, Wand2 } from 'lucide-react';
import { getCardStyle, getTitleStyle, getDescStyle, getButtonStyle } from '../../styles/components';
import useAI from '../../hooks/useAI';
import AIStreamingText from '../AI/AIStreamingText';
import { GRAVITY_REFRAME_PROMPT } from '../../data/aiPrompts';

const GravityProblem = ({ gravityQuestions, assessments, onAdd, onRemove }) => {
  const [step, setStep] = useState('input'); // input | quiz | result
  const [problem, setProblem] = useState('');
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [reframed, setReframed] = useState('');
  const [aiProblemInput, setAiProblemInput] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState('');
  const { loading: aiLoading, streamingText, generateStreamingWithTemplate, clearState: clearAI } = useAI();

  const handleAISuggest = async () => {
    if (!aiProblemInput.trim()) return;
    setAiSuggestion('');
    try {
      const text = await generateStreamingWithTemplate(GRAVITY_REFRAME_PROMPT, {
        problem: aiProblemInput,
      });
      setAiSuggestion(text);
    } catch (err) {
      setAiSuggestion('AI 生成失败: ' + err.message);
    }
  };

  const handleStartQuiz = () => {
    if (!problem.trim()) return;
    setStep('quiz');
  };

  const handleAnswer = (qId, answer) => {
    setAnswers(prev => ({ ...prev, [qId]: answer }));
  };

  const allAnswered = gravityQuestions.every(q => answers[q.id] !== undefined);

  const handleSubmit = () => {
    if (!allAnswered) return;
    const yesCount = Object.values(answers).filter(a => a === 'yes').length;
    const ratio = yesCount / gravityQuestions.length;

    let assessment;
    if (ratio >= 0.6) {
      assessment = {
        type: 'gravity',
        label: '重力问题',
        description: '这个问题很可能是一个"重力问题" -- 它像地球引力一样，是你无法改变的现实。接受它，然后在约束下重新设计。',
        color: 'var(--color-text)',
        bgColor: 'var(--color-bg-elevated)',
        borderColor: 'var(--border-light)',
        icon: <Anchor style={{ color: 'var(--color-text-muted)' }} size={24} />,
      };
    } else if (ratio >= 0.3) {
      assessment = {
        type: 'mixed',
        label: '边界问题',
        description: '这个问题有部分是重力问题，但也有可以行动的空间。你需要区分哪些部分可以改变，哪些需要接受。',
        color: 'var(--color-accent)',
        bgColor: 'var(--color-bg)',
        borderColor: 'var(--border-warm)',
        icon: <HelpCircle style={{ color: 'var(--color-accent)' }} size={24} />,
      };
    } else {
      assessment = {
        type: 'solvable',
        label: '可解决问题',
        description: '这个问题看起来是可以解决的！用设计思维的方法 -- 原型、测试、迭代 -- 来找到解决方案。',
        color: 'var(--color-primary)',
        bgColor: 'var(--color-bg-elevated)',
        borderColor: 'var(--border-warm)',
        icon: <CheckCircle style={{ color: 'var(--color-primary)' }} size={24} />,
      };
    }
    setResult(assessment);
    setStep('result');
  };

  const handleSave = () => {
    const yesCount = Object.values(answers).filter(a => a === 'yes').length;
    onAdd({
      problem,
      answers,
      result: { ...result, yesCount, total: gravityQuestions.length },
      reframed,
    });
    handleReset();
  };

  const handleReset = () => {
    setStep('input');
    setProblem('');
    setAnswers({});
    setResult(null);
    setReframed('');
    setAiProblemInput('');
    setAiSuggestion('');
    clearAI();
  };

  const cardStyle = getCardStyle();
  const titleStyle = getTitleStyle('lg');
  const descStyle = getDescStyle();
  const primaryBtnStyle = getButtonStyle('primary');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-3" style={{ backgroundColor: 'var(--color-bg-elevated)' }}>
          <Anchor style={{ color: 'var(--color-text-muted)' }} size={28} />
        </div>
        <h3 style={{ ...titleStyle, fontSize: '1.25rem', marginBottom: '0.25rem' }}>重力问题识别器</h3>
        <p style={descStyle}>
          "如果它不可被解决，那它就不是一个问题，而是一个事实。"
        </p>
      </div>

      {/* 输入步骤 */}
      {step === 'input' && (
        <div className="space-y-4">
          <div style={cardStyle} className="p-5">
            <label className="text-sm font-bold block mb-2" style={{ color: 'var(--color-text)' }}>描述你面临的困境</label>
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder='例如："我想当自由撰稿人，但写作赚不到足够的钱"'
              className="w-full p-3 rounded-lg text-sm resize-none focus:outline-none focus:ring-2"
              style={{ border: 'var(--border-light)', backgroundColor: 'var(--color-bg-card)' }}
              rows={3}
            />
          </div>
          <button
            onClick={handleStartQuiz}
            disabled={!problem.trim()}
            className="w-full py-3 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2"
            style={problem.trim()
              ? primaryBtnStyle
              : { backgroundColor: 'var(--color-bg-elevated)', cursor: 'not-allowed', color: 'var(--color-text-muted)', borderRadius: 'var(--radius-xl)' }}
          >
            开始诊断 <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* 问答步骤 */}
      {step === 'quiz' && (
        <div className="space-y-4">
          <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--color-bg-elevated)', border: 'var(--border-light)' }}>
            <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>"{problem}"</p>
          </div>

          {gravityQuestions.map((q, idx) => (
            <div key={q.id} style={cardStyle} className="p-4">
              <p className="text-sm mb-3" style={{ color: 'var(--color-text)' }}>
                <span className="font-bold mr-2" style={{ color: 'var(--color-text-muted)' }}>{idx + 1}.</span>
                {q.question}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleAnswer(q.id, 'yes')}
                  className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
                  style={answers[q.id] === 'yes'
                    ? { backgroundColor: 'var(--color-text)', color: 'white' }
                    : { backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-secondary)' }}
                >
                  是
                </button>
                <button
                  onClick={() => handleAnswer(q.id, 'no')}
                  className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
                  style={answers[q.id] === 'no'
                    ? { backgroundColor: 'var(--color-primary)', color: 'white' }
                    : { backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-secondary)' }}
                >
                  否
                </button>
              </div>
            </div>
          ))}

          <div className="flex gap-3">
            <button
              onClick={() => setStep('input')}
              className="flex-1 py-3 rounded-xl font-medium transition-colors"
              style={{ color: 'var(--color-text-secondary)', backgroundColor: 'var(--color-bg-elevated)' }}
            >
              返回
            </button>
            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="flex-1 py-3 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2"
              style={allAnswered
                ? primaryBtnStyle
                : { backgroundColor: 'var(--color-bg-elevated)', cursor: 'not-allowed', color: 'var(--color-text-muted)', borderRadius: 'var(--radius-xl)' }}
            >
              查看诊断 <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* 结果步骤 */}
      {step === 'result' && result && (
        <div className="space-y-4">
          <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: result.bgColor, border: `1px solid ${result.borderColor}` }}>
            <div className="mb-3">{result.icon}</div>
            <h4 className="text-xl font-bold mb-2" style={{ color: result.color }}>{result.label}</h4>
            <p className="text-sm leading-relaxed" style={{ color: result.color }}>{result.description}</p>
          </div>

          {result.type !== 'solvable' && (
            <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--color-bg)', border: 'var(--border-warm)' }}>
              <label className="text-sm font-bold block mb-2" style={{ color: 'var(--color-primary)' }}>
                重新设计：在接受现实后，你能做什么？
              </label>
              <textarea
                value={reframed}
                onChange={(e) => setReframed(e.target.value)}
                placeholder='例如："在接受写作收入有限的现实后，我可以先通过其他工作获得稳定收入，同时利用业余时间建立写作品牌"'
                className="w-full p-3 rounded-lg text-sm resize-none focus:outline-none focus:ring-2"
                style={{ border: 'var(--border-warm)', backgroundColor: 'var(--color-bg-card)' }}
                rows={3}
              />
            </div>
          )}

          {/* AI 重构建议 */}
          <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--color-bg)', border: 'var(--border-warm)' }}>
            <label className="text-sm font-bold block mb-2" style={{ color: 'var(--color-accent)' }}>
              <Wand2 size={14} className="inline mr-1" /> AI 重构建议
            </label>
            <p className="text-xs mb-3" style={{ color: 'var(--color-text-muted)' }}>
              描述你的具体困境，AI 帮你重新框架问题
            </p>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={aiProblemInput}
                onChange={(e) => setAiProblemInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAISuggest()}
                placeholder="描述你的重力问题..."
                className="flex-1 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2"
                style={{ border: 'var(--border-light)', backgroundColor: 'var(--color-bg-card)' }}
              />
              <button
                onClick={handleAISuggest}
                disabled={aiLoading || !aiProblemInput.trim()}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                style={aiLoading || !aiProblemInput.trim()
                  ? { backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-muted)', cursor: 'not-allowed' }
                  : { backgroundColor: 'var(--color-accent)', color: 'white' }
                }
              >
                <Wand2 size={14} /> {aiLoading ? '生成中...' : 'AI 重构'}
              </button>
            </div>
            {(streamingText || aiSuggestion) && (
              <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--color-bg-card)', border: 'var(--border-light)' }}>
                <AIStreamingText text={aiSuggestion || streamingText} loading={aiLoading} />
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
              style={{ color: 'var(--color-text-secondary)', backgroundColor: 'var(--color-bg-elevated)' }}
            >
              <RotateCcw size={16} /> 重新开始
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 rounded-xl font-bold text-white transition-colors"
              style={primaryBtnStyle}
            >
              保存诊断记录
            </button>
          </div>
        </div>
      )}

      {/* 历史记录 */}
      {assessments.length > 0 && (
        <div className="space-y-3 pt-4" style={{ borderTop: 'var(--border-light)' }}>
          <h4 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>诊断记录 ({assessments.length})</h4>
          {assessments.map((a) => (
            <div key={a.id} style={cardStyle} className="p-4 group relative">
              <button
                onClick={() => onRemove(a.id)}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <XCircle size={14} />
              </button>
              <p className="text-sm font-medium mb-2 line-clamp-2" style={{ color: 'var(--color-text)' }}>{a.problem}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded" style={
                  a.result.type === 'gravity'
                    ? { backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-secondary)' }
                    : a.result.type === 'mixed'
                    ? { backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-accent)' }
                    : { backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-primary)' }
                }>
                  {a.result.label}
                </span>
                <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  {new Date(a.timestamp).toLocaleDateString('zh-CN')}
                </span>
              </div>
              {a.reframed && (
                <p className="text-xs mt-2 line-clamp-2" style={{ color: 'var(--color-primary)' }}>重构: {a.reframed}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GravityProblem;
