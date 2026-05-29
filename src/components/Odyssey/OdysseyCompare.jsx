import React from 'react';
import { TrendingUp, TrendingDown, Minus, BarChart2 } from 'lucide-react';
import { getCardStyle, getTitleStyle, getDescStyle } from '../../styles/components';

const metricLabels = {
  resources: '资源充足度',
  like: '兴趣匹配度',
  confidence: '信心指数',
  coherence: '一致性评分'
};

const getScoreColor = (value) => {
  if (value < 30) return 'var(--color-error)';
  if (value < 50) return 'var(--color-accent)';
  if (value < 70) return 'var(--color-secondary)';
  if (value < 85) return 'var(--color-primary)';
  return 'var(--color-primary)';
};

const getBarColor = (value) => {
  if (value < 30) return 'var(--color-error)';
  if (value < 50) return 'var(--color-accent)';
  if (value < 70) return 'var(--color-secondary)';
  if (value < 85) return 'var(--color-primary)';
  return 'var(--color-primary)';
};

const getTrend = (a, b) => {
  const diff = a - b;
  if (Math.abs(diff) < 5) return { icon: Minus, text: '持平', color: 'var(--color-text-muted)' };
  if (diff > 0) return { icon: TrendingUp, text: `+${diff}`, color: 'var(--color-primary)' };
  return { icon: TrendingDown, text: `${diff}`, color: 'var(--color-error)' };
};

const OdysseyCompare = ({ plans, ratings, comparisonData, colorMap }) => {
  if (!plans || plans.length === 0) return null;

  const cardStyle = getCardStyle();
  const elevatedCardStyle = getCardStyle(true);
  const titleStyle = getTitleStyle('lg');
  const descStyle = getDescStyle();

  // 计算每个计划的综合评分
  const planScores = plans.map(plan => {
    const rating = ratings[plan.id] || { resources: 50, like: 50, confidence: 50, coherence: 50 };
    const avgRating = Object.values(rating).reduce((a, b) => a + b, 0) / 4;
    const resourceScore = Object.values(plan.resources || {}).reduce((a, b) => a + b, 0) / Object.keys(plan.resources || {}).length;
    return {
      id: plan.id,
      title: plan.title,
      color: plan.color,
      rating,
      avgRating: Math.round(avgRating),
      resourceScore: Math.round(resourceScore),
      overall: Math.round((avgRating + resourceScore) / 2)
    };
  });

  // 排名
  const ranked = [...planScores].sort((a, b) => b.overall - a.overall);

  return (
    <div className="space-y-6">
      {/* 总览排名 */}
      <div style={cardStyle} className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <BarChart2 size={20} style={{ color: 'var(--color-text-secondary)' }} />
          <h4 style={{ ...titleStyle, marginBottom: 0 }}>计划综合排名</h4>
        </div>
        <div className="space-y-4">
          {ranked.map((plan, idx) => {
            const colors = colorMap[plan.color];
            const medal = idx === 0 ? '  ' : idx === 1 ? '  ' : '  ';
            return (
              <div key={plan.id} className="flex items-center gap-4">
                <span className="text-lg w-8 text-center">{medal}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold ${colors?.badge || 'bg-slate-500'}`}>
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold truncate" style={{ color: 'var(--color-text)' }}>{plan.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-bg-elevated)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${plan.overall}%`, backgroundColor: getBarColor(plan.overall) }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold" style={{ color: getScoreColor(plan.overall) }}>{plan.overall}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 详细对比表格 */}
      <div style={cardStyle} className="overflow-hidden">
        <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border-light)' }}>
          <h5 style={{ ...titleStyle, fontSize: '1rem', marginBottom: 0 }}>多维度对比详情</h5>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: 'var(--color-bg-elevated)' }}>
                <th className="text-left px-6 py-3 font-bold" style={{ color: 'var(--color-text-secondary)' }}>评估维度</th>
                {planScores.map(plan => {
                  const colors = colorMap[plan.color];
                  return (
                    <th key={plan.id} className="text-center px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold text-white ${colors?.badge || 'bg-slate-500'}`}>
                        {plan.title.split('：')[1]}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {Object.entries(metricLabels).map(([key, label]) => {
                const values = planScores.map(p => p.rating[key] || 0);
                const maxVal = Math.max(...values);
                return (
                  <tr key={key} className="transition-colors" style={{ borderTop: 'var(--border-light)' }}>
                    <td className="px-6 py-3.5 font-medium" style={{ color: 'var(--color-text)' }}>{label}</td>
                    {planScores.map((plan, idx) => {
                      const val = plan.rating[key] || 0;
                      const isMax = val === maxVal;
                      return (
                        <td key={plan.id} className="text-center px-4 py-3.5">
                          <div className="flex flex-col items-center gap-1">
                            <span className="font-bold" style={{ color: isMax ? 'var(--color-text)' : 'var(--color-text-secondary)', fontSize: isMax ? '1rem' : undefined }}>
                              {val}%
                            </span>
                            <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-bg-elevated)' }}>
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${val}%`, backgroundColor: isMax ? 'var(--color-text)' : getBarColor(val) }}
                              ></div>
                            </div>
                            {isMax && (
                              <span className="text-[10px] font-bold" style={{ color: 'var(--color-text-muted)' }}>最高</span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              <tr className="font-bold" style={{ borderTop: '2px solid var(--border-light)', backgroundColor: 'var(--color-bg-elevated)' }}>
                <td className="px-6 py-3.5" style={{ color: 'var(--color-text)' }}>综合评分</td>
                {planScores.map(plan => (
                  <td key={plan.id} className="text-center px-4 py-3.5">
                    <span className="text-lg" style={{ color: getScoreColor(plan.overall) }}>{plan.overall}</span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 雷达图替代：条形对比 */}
      <div style={cardStyle} className="p-6">
        <h5 style={{ ...titleStyle, fontSize: '1rem', marginBottom: '1.25rem' }}>可视化对比</h5>
        <div className="space-y-5">
          {Object.entries(metricLabels).map(([key, label]) => (
            <div key={key}>
              <div className="text-sm font-bold mb-2" style={{ color: 'var(--color-text-secondary)' }}>{label}</div>
              <div className="space-y-2">
                {planScores.map(plan => {
                  const val = plan.rating[key] || 0;
                  const colors = colorMap[plan.color];
                  return (
                    <div key={plan.id} className="flex items-center gap-3">
                      <div className="w-20 text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>{plan.title.split('：')[1]}</div>
                      <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-bg-elevated)' }}>
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${val}%`, backgroundColor: colors?.bar ? undefined : 'var(--color-primary)' }}
                        ></div>
                      </div>
                      <span className="w-10 text-right text-xs font-bold" style={{ color: getScoreColor(val) }}>{val}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 建议 */}
      <div className="rounded-xl p-5" style={elevatedCardStyle}>
        <h5 style={{ ...titleStyle, fontSize: '1rem', marginBottom: '0.75rem' }}>对比分析建议</h5>
        <div className="space-y-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          <p>
            <span className="font-bold">综合最优：</span>
            <span style={{ color: getScoreColor(ranked[0]?.overall) }}>{ranked[0]?.title}</span>
            （综合评分 {ranked[0]?.overall}），在当前资源和信心维度上表现最佳。
          </p>
          {ranked.length >= 2 && ranked[0].overall - ranked[1].overall < 10 && (
            <p>
              <span className="font-bold" style={{ color: 'var(--color-accent)' }}>注意：</span>
              前两个计划评分差距很小（{ranked[0].overall - ranked[1].overall} 分），说明它们都有可行性，
              建议通过原型体验进一步验证。
            </p>
          )}
          {planScores.some(p => p.rating.confidence < 30) && (
            <p>
              <span className="font-bold" style={{ color: 'var(--color-accent)' }}>信心不足：</span>
              {planScores.filter(p => p.rating.confidence < 30).map(p => p.title.split('：')[1]).join('、')}
              的信心指数较低，建议先做小规模原型体验来增强信心。
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OdysseyCompare;
