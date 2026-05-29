import React from 'react';
import { Briefcase, TrendingUp, TrendingDown, Zap, Focus, ChevronRight, AlertCircle } from 'lucide-react';
import { getCardStyle } from '../../styles/components';

/**
 * 好时光日志工作关联分析
 * 标记活动类型，分析工作中的能量来源
 */
const JournalWorkAnalysis = ({ workAnalysis }) => {
  const { hasData, totalWork, workFlowCount, workFlowRatio, avgWorkEnergy, avgWorkEngagement, workVsNonWork, energySources, suggestions } = workAnalysis;

  if (!hasData) {
    return (
      <div
        className="rounded-xl overflow-hidden"
        style={{ ...getCardStyle(), border: 'var(--border-light)' }}
      >
        <div
          className="px-4 py-3"
          style={{ borderBottom: 'var(--border-light)' }}
        >
          <h4
            className="text-sm font-bold flex items-center gap-2"
            style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
          >
            <Briefcase size={16} style={{ color: 'var(--color-accent)' }} />
            工作能量分析
          </h4>
        </div>
        <div className="p-6 text-center">
          <div
            className="w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center"
            style={{ background: 'var(--color-bg-elevated)' }}
          >
            <Briefcase className="w-7 h-7" style={{ color: 'var(--color-text-muted)' }} />
          </div>
          <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>暂无工作活动数据</p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>在记录活动时选择"工作"分类，即可查看工作能量分析</p>
          <div
            className="mt-3 inline-flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-full"
            style={{ color: 'var(--color-accent)', background: 'var(--color-bg-elevated)', fontFamily: 'var(--font-body)' }}
          >
            <AlertCircle size={11} />
            提示：标记工作中的具体活动，分析结果更精准
          </div>
        </div>
      </div>
    );
  }

  const getFlowBarStyle = (ratio) => {
    if (ratio >= 50) return { color: 'var(--color-primary)', background: 'var(--color-bg-elevated)' };
    if (ratio >= 30) return { color: 'var(--color-secondary)', background: 'var(--color-bg-elevated)' };
    return { color: 'var(--color-error)', background: 'var(--color-bg-elevated)' };
  };

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ ...getCardStyle(), border: 'var(--border-light)' }}
    >
      {/* 标题栏 */}
      <div
        className="px-4 py-3"
        style={{ borderBottom: 'var(--border-light)' }}
      >
        <h4
          className="text-sm font-bold flex items-center gap-2"
          style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
        >
          <Briefcase size={16} style={{ color: 'var(--color-accent)' }} />
          工作能量分析
        </h4>
      </div>

      <div className="p-4 space-y-4">
        {/* 核心指标 */}
        <div className="grid grid-cols-2 gap-3">
          <div
            className="rounded-lg p-3"
            style={{ background: 'var(--color-bg-elevated)', border: 'var(--border-light)' }}
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <Zap size={13} style={{ color: 'var(--color-primary)' }} />
              <span className="text-[10px] font-medium" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-body)' }}>工作平均能量</span>
            </div>
            <div className="text-lg font-bold" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>{avgWorkEnergy}</div>
            <div className="w-full rounded-full h-1.5 mt-1.5" style={{ background: 'var(--color-bg)' }}>
              <div
                className="h-1.5 rounded-full transition-all"
                style={{
                  background: avgWorkEnergy >= 6 ? 'var(--color-primary)' : avgWorkEnergy >= 4 ? 'var(--color-secondary)' : 'var(--color-error)',
                  width: `${avgWorkEnergy * 10}%`,
                }}
              />
            </div>
          </div>
          <div
            className="rounded-lg p-3"
            style={{ background: 'var(--color-bg-elevated)', border: 'var(--border-light)' }}
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <Focus size={13} style={{ color: 'var(--color-accent)' }} />
              <span className="text-[10px] font-medium" style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-body)' }}>工作平均专注</span>
            </div>
            <div className="text-lg font-bold" style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-heading)' }}>{avgWorkEngagement}</div>
            <div className="w-full rounded-full h-1.5 mt-1.5" style={{ background: 'var(--color-bg)' }}>
              <div
                className="h-1.5 rounded-full transition-all"
                style={{
                  background: avgWorkEngagement >= 6 ? 'var(--color-primary)' : avgWorkEngagement >= 4 ? 'var(--color-secondary)' : 'var(--color-error)',
                  width: `${avgWorkEngagement * 10}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* 工作心流占比 */}
        <div
          className="rounded-lg p-3"
          style={{ background: 'var(--color-bg-elevated)', border: 'var(--border-light)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>工作心流比例</span>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={getFlowBarStyle(workFlowRatio)}
            >
              {workFlowRatio}%
            </span>
          </div>
          <div className="w-full rounded-full h-2.5" style={{ background: 'var(--color-bg)' }}>
            <div
              className="h-2.5 rounded-full transition-all duration-500"
              style={{
                background: workFlowRatio >= 50 ? 'var(--color-primary)' : workFlowRatio >= 30 ? 'var(--color-secondary)' : 'var(--color-error)',
                width: `${Math.min(workFlowRatio, 100)}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-[9px] mt-1" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
            <span>{workFlowCount}/{totalWork} 项活动</span>
            <span>目标: 50%+</span>
          </div>
        </div>

        {/* 工作 vs 非工作对比 */}
        {workVsNonWork && (
          <div
            className="rounded-lg p-3"
            style={{ background: 'var(--color-bg-elevated)', border: 'var(--border-light)' }}
          >
            <h5 className="text-[10px] font-bold mb-2 uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-heading)' }}>工作 vs 非工作对比</h5>
            <div className="grid grid-cols-2 gap-3">
              {/* 能量对比 */}
              <div>
                <div className="text-[9px] mb-1.5" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>平均能量</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="text-[9px] w-6" style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-body)' }}>工作</span>
                      <div className="flex-1 rounded-full h-1.5" style={{ background: 'var(--color-bg)' }}>
                        <div
                          className="h-1.5 rounded-full transition-all"
                          style={{ background: 'var(--color-accent)', width: `${workVsNonWork.workEnergy * 10}%` }}
                        />
                      </div>
                      <span className="text-[9px] w-5 text-right" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}>{workVsNonWork.workEnergy}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] w-6" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-body)' }}>其他</span>
                      <div className="flex-1 rounded-full h-1.5" style={{ background: 'var(--color-bg)' }}>
                        <div
                          className="h-1.5 rounded-full transition-all"
                          style={{ background: 'var(--color-primary)', width: `${workVsNonWork.nonWorkEnergy * 10}%` }}
                        />
                      </div>
                      <span className="text-[9px] w-5 text-right" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}>{workVsNonWork.nonWorkEnergy}</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* 专注对比 */}
              <div>
                <div className="text-[9px] mb-1.5" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>平均专注度</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="text-[9px] w-6" style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-body)' }}>工作</span>
                      <div className="flex-1 rounded-full h-1.5" style={{ background: 'var(--color-bg)' }}>
                        <div
                          className="h-1.5 rounded-full transition-all"
                          style={{ background: 'var(--color-accent)', width: `${workVsNonWork.workEngagement * 10}%` }}
                        />
                      </div>
                      <span className="text-[9px] w-5 text-right" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}>{workVsNonWork.workEngagement}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] w-6" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-body)' }}>其他</span>
                      <div className="flex-1 rounded-full h-1.5" style={{ background: 'var(--color-bg)' }}>
                        <div
                          className="h-1.5 rounded-full transition-all"
                          style={{ background: 'var(--color-primary)', width: `${workVsNonWork.nonWorkEngagement * 10}%` }}
                        />
                      </div>
                      <span className="text-[9px] w-5 text-right" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}>{workVsNonWork.nonWorkEngagement}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* 对比结论 */}
            <div className="mt-2 pt-2" style={{ borderTop: 'var(--border-light)' }}>
              {workVsNonWork.workEnergy > workVsNonWork.nonWorkEnergy ? (
                <div className="flex items-center gap-1.5 text-[10px]" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-body)' }}>
                  <TrendingUp size={12} />
                  工作给你带来能量，继续保持！
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-[10px]" style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-body)' }}>
                  <TrendingDown size={12} />
                  工作消耗了更多能量，注意调整
                </div>
              )}
            </div>
          </div>
        )}

        {/* 工作能量来源排名 */}
        {energySources.length > 0 && (
          <div>
            <h5 className="text-xs font-bold mb-2 flex items-center gap-1.5" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>
              <Zap size={13} style={{ color: 'var(--color-secondary)' }} />
              工作能量来源 TOP {energySources.length}
            </h5>
            <div className="space-y-2">
              {energySources.map((source, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 rounded-lg px-3 py-2"
                  style={{ background: 'var(--color-bg-elevated)', border: 'var(--border-light)' }}
                >
                  <span
                    className="text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full"
                    style={{
                      background: idx === 0 ? 'var(--color-secondary)' : 'var(--color-bg)',
                      color: idx === 0 ? 'var(--color-text)' : 'var(--color-text-secondary)',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    {idx + 1}
                  </span>
                  <span className="flex-1 text-xs font-medium truncate" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}>{source.name}</span>
                  <div className="flex gap-1.5">
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded font-mono"
                      style={{ background: 'var(--color-bg-elevated)', color: 'var(--color-accent)' }}
                    >
                      专注 {source.engagement}
                    </span>
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded font-mono"
                      style={{
                        background: 'var(--color-bg-elevated)',
                        color: source.energy >= 7 ? 'var(--color-primary)' : source.energy >= 4 ? 'var(--color-secondary)' : 'var(--color-error)',
                      }}
                    >
                      能量 {source.energy}
                    </span>
                    {source.isFlow && (
                      <span
                        className="text-[8px] px-1.5 py-0.5 rounded-full"
                        style={{ background: 'var(--color-bg-elevated)', color: 'var(--color-primary)', fontFamily: 'var(--font-body)' }}
                      >
                        心流
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 分析建议 */}
        {suggestions.length > 0 && (
          <div
            className="rounded-lg p-3"
            style={{ background: 'var(--color-bg-elevated)', border: 'var(--border-light)' }}
          >
            <h5 className="text-xs font-bold mb-2" style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-heading)' }}>工作建议</h5>
            <ul className="space-y-1.5">
              {suggestions.map((s, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}>
                  <ChevronRight size={12} className="flex-shrink-0 mt-0.5" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalWorkAnalysis;
