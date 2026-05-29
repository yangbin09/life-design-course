import React from 'react';
import { BarChart2 } from 'lucide-react';
import { getCardStyle, getTitleStyle, getDescStyle } from '../../styles/components';

const metrics = [
  { id: 'resources', label: '我有资源吗?', sub: '(时间、金钱、人脉)' },
  { id: 'like', label: '我喜欢吗?', sub: '(无论成败都享受)' },
  { id: 'confidence', label: '我有信心吗?', sub: '(哪怕很难也能做到)' },
  { id: 'coherence', label: '符合一致性吗?', sub: '(这就是我吗)' }
];

const getScoreColor = (value) => {
  if (value < 30) return { text: 'var(--color-error)', bg: 'var(--color-error)' };
  if (value < 50) return { text: 'var(--color-accent)', bg: 'var(--color-accent)' };
  if (value < 70) return { text: 'var(--color-secondary)', bg: 'var(--color-secondary)' };
  if (value < 85) return { text: 'var(--color-primary)', bg: 'var(--color-primary)' };
  return { text: 'var(--color-primary)', bg: 'var(--color-primary)' };
};

const getScoreLabel = (value) => {
  if (value < 20) return '非常低';
  if (value < 40) return '偏低';
  if (value < 60) return '一般';
  if (value < 80) return '较好';
  return '非常好';
};

const OdysseyRating = ({ planId, rating, onUpdateRating, colors }) => {
  const ratingData = rating || { resources: 50, like: 50, confidence: 50, coherence: 50 };
  const avgScore = Object.values(ratingData).reduce((a, b) => a + b, 0) / 4;
  const avgColor = getScoreColor(avgScore);
  const cardStyle = getCardStyle();
  const elevatedCardStyle = getCardStyle(true);
  const titleStyle = getTitleStyle('lg');

  return (
    <div className="space-y-6">
      {/* 总览卡片 */}
      <div className={`${colors.bg} rounded-xl p-6 border ${colors.border}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BarChart2 size={24} className={colors.accent} />
            <div>
              <h4 style={{ ...titleStyle, marginBottom: 0 }}>计划评估仪表</h4>
              <p style={getDescStyle()}>对这个计划进行多维度压力测试</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: avgColor.text }}>{Math.round(avgScore)}</div>
              <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>综合评分</div>
            </div>
            <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ color: avgColor.text, backgroundColor: 'var(--color-bg-elevated)' }}>
              {getScoreLabel(avgScore)}
            </span>
          </div>
        </div>
      </div>

      {/* 评分项 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {metrics.map((metric) => {
          const value = ratingData[metric.id] || 50;
          const scoreColor = getScoreColor(value);

          return (
            <div key={metric.id} style={cardStyle} className="p-5 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h5 className="font-bold" style={{ color: 'var(--color-text)' }}>{metric.label}</h5>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{metric.sub}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold" style={{ color: scoreColor.text }}>{value}%</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold" style={{ color: scoreColor.text, backgroundColor: 'var(--color-bg-elevated)' }}>
                    {getScoreLabel(value)}
                  </span>
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={value}
                onChange={(e) => onUpdateRating(metric.id, parseInt(e.target.value))}
                className="w-full h-2.5 rounded-lg appearance-none cursor-pointer"
                style={{ backgroundColor: 'var(--color-bg-elevated)' }}
              />

              {/* 分段指示 */}
              <div className="flex justify-between mt-1.5">
                <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>低</span>
                <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>中</span>
                <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>高</span>
              </div>

              {/* 进度条 */}
              <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-bg-elevated)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${value}%`, backgroundColor: scoreColor.bg }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 评分建议 */}
      <div className="rounded-xl p-5" style={elevatedCardStyle}>
        <h5 style={{ ...titleStyle, fontSize: '1rem', marginBottom: '0.75rem' }}>评分解读</h5>
        <div className="space-y-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          {avgScore < 40 && (
            <p className="flex items-start gap-2">
              <span className="shrink-0" style={{ color: 'var(--color-error)' }}>•</span>
              这个计划的综合评分较低。建议重新审视计划的可行性，或者调整计划内容以提高匹配度。
            </p>
          )}
          {avgScore >= 40 && avgScore < 60 && (
            <p className="flex items-start gap-2">
              <span className="shrink-0" style={{ color: 'var(--color-secondary)' }}>•</span>
              这个计划有一定的可行性，但还有改进空间。可以尝试增加资源投入或降低预期难度。
            </p>
          )}
          {avgScore >= 60 && avgScore < 80 && (
            <p className="flex items-start gap-2">
              <span className="shrink-0" style={{ color: 'var(--color-primary)' }}>•</span>
              这个计划较为可行。继续完善细节，制定具体的行动计划，可以开始尝试原型验证。
            </p>
          )}
          {avgScore >= 80 && (
            <p className="flex items-start gap-2">
              <span className="shrink-0" style={{ color: 'var(--color-primary)' }}>•</span>
              这个计划与你的现状和期望高度匹配！建议尽快制定详细的6个月行动计划并开始执行。
            </p>
          )}
          {Object.entries(ratingData).some(([k, v]) => v < 30) && (
            <p className="flex items-start gap-2">
              <span className="shrink-0" style={{ color: 'var(--color-accent)' }}>•</span>
              存在评分极低的维度（{Object.entries(ratingData).filter(([_, v]) => v < 30).map(([k]) => metrics.find(m => m.id === k)?.label).join('、')}），
              这可能是计划的瓶颈所在，需要重点关注。
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OdysseyRating;
