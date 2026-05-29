import React, { useState, useMemo } from 'react';
import { Target, CheckCircle, RotateCcw, ChevronRight, Sparkles, Loader2 } from 'lucide-react';
import { getCardStyle, getButtonStyle, getTitleStyle, getDescStyle } from '../../styles/components';
import useAI from '../../hooks/useAI';
import { useAIContext } from '../../contexts/AIContext';
import AIButton from '../AI/AIButton';
import AIStreamingText from '../AI/AIStreamingText';
import { ALIGNMENT_DIMENSION_PROMPT, ALIGNMENT_OVERVIEW_PROMPT } from '../../data/aiPrompts';

const DIM_LABELS = {
  meaning: '意义感', values: '价值观', purpose: '目的性', strengths: '优势发挥',
  impact: '影响力', life: '生活充实', priorities: '优先级', direction: '方向感',
  balance: '平衡感', acceptance: '接纳度',
};

const CompassAlignment = ({ alignmentQuestions, alignmentScores, onCalculate }) => {
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(alignmentScores ? 'result' : 'quiz');
  const [aiOverview, setAiOverview] = useState('');
  const [aiOverviewLoading, setAiOverviewLoading] = useState(false);
  const [aiDimension, setAiDimension] = useState({}); // { [dimension]: { text, loading } }
  const { loading: aiLoading, generateStreamingWithTemplate, isConfigured } = useAI();
  const { userData, getSystemPromptWithContext } = useAIContext();

  const handleAnswer = (qId, score) => {
    setAnswers(prev => ({ ...prev, [qId]: score }));
  };

  const allAnswered = alignmentQuestions.every(q => answers[q.id] !== undefined);

  const handleSubmit = () => {
    if (!allAnswered) return;
    const formatted = alignmentQuestions.map(q => ({
      dimension: q.dimension,
      score: answers[q.id],
    }));
    onCalculate(formatted);
    setStep('result');
  };

  const handleRetry = () => {
    setAnswers({});
    setStep('quiz');
    setAiOverview('');
    setAiDimension({});
  };

  // AI 分析总览
  const handleAIOverview = async () => {
    if (!isConfigured || aiOverviewLoading) return;
    setAiOverviewLoading(true);
    setAiOverview('');
    try {
      const workView = userData.compass?.workView || '';
      const lifeView = userData.compass?.lifeView || '';
      const dimensionScores = alignmentScores.radarData
        .map(d => `${DIM_LABELS[d.dimension] || d.dimension}: ${d.score}`)
        .join(', ');
      const text = await generateStreamingWithTemplate(ALIGNMENT_OVERVIEW_PROMPT, {
        totalScore: alignmentScores.totalScore,
        dimensionScores,
        workView,
        lifeView,
      });
      setAiOverview(text);
    } catch (err) {
      setAiOverview(`分析失败: ${err.message}`);
    } finally {
      setAiOverviewLoading(false);
    }
  };

  // AI 分析单个维度
  const handleAIDimension = async (dimension, score) => {
    if (!isConfigured || aiDimension[dimension]?.loading) return;
    setAiDimension(prev => ({ ...prev, [dimension]: { text: '', loading: true } }));
    try {
      const workView = userData.compass?.workView || '';
      const lifeView = userData.compass?.lifeView || '';
      const text = await generateStreamingWithTemplate(ALIGNMENT_DIMENSION_PROMPT, {
        dimension: DIM_LABELS[dimension] || dimension,
        score,
        workView,
        lifeView,
      });
      setAiDimension(prev => ({ ...prev, [dimension]: { text, loading: false } }));
    } catch (err) {
      setAiDimension(prev => ({ ...prev, [dimension]: { text: `分析失败: ${err.message}`, loading: false } }));
    }
  };

  // 简易雷达图（纯SVG实现）
  const RadarChart = ({ data }) => {
    const cx = 150, cy = 150, r = 110;
    const angleStep = (2 * Math.PI) / data.length;

    const points = data.map((d, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const dist = (d.score / 100) * r;
      return {
        x: cx + dist * Math.cos(angle),
        y: cy + dist * Math.sin(angle),
        labelX: cx + (r + 25) * Math.cos(angle),
        labelY: cy + (r + 25) * Math.sin(angle),
        label: d.dimension,
        score: d.score,
      };
    });

    const polygonPoints = points.map(p => `${p.x},${p.y}`).join(' ');

    // 网格圈
    const rings = [0.25, 0.5, 0.75, 1].map(scale => {
      const ringPoints = data.map((_, i) => {
        const angle = i * angleStep - Math.PI / 2;
        return `${cx + r * scale * Math.cos(angle)},${cy + r * scale * Math.sin(angle)}`;
      });
      return ringPoints.join(' ');
    });

    return (
      <svg viewBox="0 0 300 300" className="w-full max-w-sm mx-auto">
        {/* 网格 */}
        {rings.map((rp, i) => (
          <polygon key={i} points={rp} fill="none" stroke="var(--border-light)" strokeWidth="1" />
        ))}
        {/* 轴线 */}
        {points.map((p, i) => (
          <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(i * angleStep - Math.PI / 2)} y2={cy + r * Math.sin(i * angleStep - Math.PI / 2)} stroke="var(--border-light)" strokeWidth="1" />
        ))}
        {/* 数据多边形 */}
        <polygon points={polygonPoints} fill="rgba(198, 123, 92, 0.2)" stroke="var(--color-primary)" strokeWidth="2" />
        {/* 数据点 */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="var(--color-primary)" />
        ))}
        {/* 标签 */}
        {points.map((p, i) => (
          <text key={i} x={p.labelX} y={p.labelY} textAnchor="middle" dominantBaseline="middle" className="text-[10px] font-medium" fill="var(--color-text-secondary)">
            {DIM_LABELS[p.label] || p.label}
          </text>
        ))}
      </svg>
    );
  };

  if (step === 'result' && alignmentScores) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="mb-2" style={getTitleStyle('xl')}>一致性检测结果</h3>
          <p className="text-sm" style={getDescStyle()}>你的工作观与人生观一致性分析</p>
        </div>

        {/* 总分 */}
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full" style={{ background: 'rgba(198, 123, 92, 0.15)', border: '4px solid var(--color-primary)' }}>
            <span className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>{alignmentScores.totalScore}</span>
          </div>
          <p className={`mt-3 font-bold text-lg ${alignmentScores.feedback.color}`}>
            {alignmentScores.feedback.text}
          </p>
        </div>

        {/* 雷达图 */}
        <div className="p-6" style={getCardStyle()}>
          <RadarChart data={alignmentScores.radarData} />
        </div>

        {/* 各维度分数 */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {alignmentScores.radarData.map((d) => (
            <div key={d.dimension} className="text-center p-3 rounded-xl" style={{ background: 'rgba(198, 123, 92, 0.1)', borderRadius: 'var(--radius-xl)' }}>
              <div className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>{d.score}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>{DIM_LABELS[d.dimension] || d.dimension}</div>
              {isConfigured && (
                <button
                  onClick={() => handleAIDimension(d.dimension, d.score)}
                  disabled={aiDimension[d.dimension]?.loading}
                  className="mt-1.5 inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full transition-colors cursor-pointer"
                  style={{
                    background: 'rgba(198,123,92,0.1)',
                    color: 'var(--color-primary)',
                    border: '1px solid rgba(198,123,92,0.2)',
                    opacity: aiDimension[d.dimension]?.loading ? 0.6 : 1,
                  }}
                >
                  {aiDimension[d.dimension]?.loading ? <Loader2 size={9} className="animate-spin" /> : <Sparkles size={9} />}
                  AI
                </button>
              )}
            </div>
          ))}
        </div>

        {/* 单维度 AI 详情 */}
        {Object.entries(aiDimension).map(([dim, state]) => state?.text ? (
          <div key={dim} className="p-4 rounded-xl text-sm leading-relaxed" style={{ background: 'rgba(198,123,92,0.05)', border: '1px solid rgba(198,123,92,0.1)' }}>
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles size={12} style={{ color: 'var(--color-primary)' }} />
              <span className="text-xs font-medium" style={{ color: 'var(--color-primary)' }}>{DIM_LABELS[dim] || dim} - AI 分析</span>
              <button
                onClick={() => setAiDimension(prev => { const next = { ...prev }; delete next[dim]; return next; })}
                className="ml-auto text-[10px] cursor-pointer"
                style={{ color: 'var(--color-text-muted)' }}
              >
                收起
              </button>
            </div>
            <AIStreamingText text={state.text} loading={state.loading} />
          </div>
        ) : null)}

        {/* AI 总览分析 */}
        {isConfigured && (
          <div className="p-5" style={getCardStyle()}>
            {!aiOverview && !aiOverviewLoading && (
              <div className="text-center">
                <AIButton onClick={handleAIOverview} loading={aiOverviewLoading} size="md">
                  AI 深度分析总览
                </AIButton>
                <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>基于你的工作观和生命观进行综合分析</p>
              </div>
            )}
            {(aiOverview || aiOverviewLoading) && (
              <div>
                <div className="flex items-center gap-1.5 mb-3">
                  <Sparkles size={14} style={{ color: 'var(--color-primary)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>AI 综合分析</span>
                  <button
                    onClick={() => setAiOverview('')}
                    className="ml-auto text-[10px] cursor-pointer"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    收起
                  </button>
                </div>
                <AIStreamingText text={aiOverview} loading={aiOverviewLoading} />
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleRetry}
          className="flex items-center gap-2 mx-auto px-4 py-2 text-sm rounded-lg transition-colors"
          style={{ color: 'var(--color-primary)' }}
        >
          <RotateCcw size={16} /> 重新检测
        </button>
      </div>
    );
  }

  // 问卷步骤
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h3 className="mb-2" style={getTitleStyle('xl')}>一致性检测</h3>
        <p className="text-sm" style={getDescStyle()}>回答以下问题，检测你的工作观与人生观是否一致</p>
        <div className="mt-3 flex items-center justify-center gap-2">
          <div className="h-2 w-40 rounded-full overflow-hidden" style={{ background: 'var(--color-bg-elevated)' }}>
            <div
              className="h-full transition-all duration-300 rounded-full"
              style={{ background: 'var(--color-primary)', width: `${(answeredCount / alignmentQuestions.length) * 100}%` }}
            />
          </div>
          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{answeredCount}/{alignmentQuestions.length}</span>
        </div>
      </div>

      <div className="space-y-4">
        {alignmentQuestions.map((q, idx) => (
          <div key={q.id} className="p-5" style={getCardStyle()}>
            <p className="text-sm font-medium mb-3" style={{ color: 'var(--color-text)' }}>
              <span className="font-bold mr-2" style={{ color: 'var(--color-primary)' }}>{idx + 1}.</span>
              {q.text}
            </p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(score => {
                const labels = ['非常不同意', '不同意', '一般', '同意', '非常同意'];
                const isSelected = answers[q.id] === score * 20;
                return (
                  <button
                    key={score}
                    onClick={() => handleAnswer(q.id, score * 20)}
                    className="flex-1 py-2 px-1 text-xs rounded-lg border transition-all"
                    style={isSelected
                      ? { background: 'var(--color-primary)', color: 'white', borderColor: 'var(--color-primary)', boxShadow: 'var(--shadow-medium)' }
                      : { background: 'var(--color-bg-elevated)', color: 'var(--color-text-secondary)', borderColor: 'var(--border-light)' }
                    }
                  >
                    {labels[score - 1]}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-2">
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white transition-all"
          style={allAnswered
            ? getButtonStyle('primary')
            : { background: 'var(--color-bg-elevated)', color: 'var(--color-text-muted)', cursor: 'not-allowed' }
          }
        >
          <Target size={18} /> 查看结果 <ChevronRight size={16} />
        </button>
        {!allAnswered && (
          <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>请回答所有问题后提交</p>
        )}
      </div>
    </div>
  );
};

export default CompassAlignment;
