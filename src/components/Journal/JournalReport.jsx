import React, { useState } from 'react';
import { Calendar, TrendingUp, Zap, Focus, BarChart3, ChevronRight } from 'lucide-react';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../../hooks/useJournal';
import { getCardStyle } from '../../styles/components';
import useAI from '../../hooks/useAI';
import AIButton from '../AI/AIButton';
import AIStreamingText from '../AI/AIStreamingText';
import { JOURNAL_ANALYSIS_PROMPT } from '../../data/aiPrompts';

/**
 * 好时光日志周报/月报组件
 * 自动生成能量报告，统计心流时间占比
 */
const JournalReport = ({ generateReport, entries = [] }) => {
  const { generateStreamingWithTemplate, streamingText, loading: aiLoading, isConfigured: aiConfigured } = useAI();
  const [period, setPeriod] = useState('week');
  const [aiResult, setAiResult] = useState(null);
  const [showAI, setShowAI] = useState(false);
  const report = generateReport(period);

  const periodLabel = period === 'week' ? '本周' : '本月';

  // 能量等级
  const getEnergyLevel = (value) => {
    if (value >= 8) return { label: '充沛', color: 'var(--color-primary)', bg: 'var(--color-bg-elevated)' };
    if (value >= 6) return { label: '良好', color: 'var(--color-accent)', bg: 'var(--color-bg-elevated)' };
    if (value >= 4) return { label: '一般', color: 'var(--color-secondary)', bg: 'var(--color-bg-elevated)' };
    return { label: '低迷', color: 'var(--color-error)', bg: 'var(--color-bg-elevated)' };
  };

  const energyLevel = getEnergyLevel(report.avgEnergy);
  const engagementLevel = getEnergyLevel(report.avgEngagement);

  // AI 能量分析
  const handleAIAnalysis = async () => {
    setShowAI(true);
    setAiResult(null);
    try {
      const result = await generateStreamingWithTemplate(JOURNAL_ANALYSIS_PROMPT, {
        entries: JSON.stringify(entries.slice(-20)),
      });
      setAiResult(result);
    } catch (err) {
      // error is handled by useAI hook
    }
  };

  // 心流进度条颜色
  const getFlowBarStyle = (ratio) => {
    if (ratio >= 50) return { background: 'var(--color-primary)' };
    if (ratio >= 30) return { background: 'var(--color-secondary)' };
    return { background: 'var(--color-error)' };
  };

  if (report.totalEntries === 0) {
    return (
      <div
        className="rounded-xl overflow-hidden"
        style={{ ...getCardStyle(), border: 'var(--border-light)' }}
      >
        <div
          className="px-4 py-3 flex items-center justify-between"
          style={{ borderBottom: 'var(--border-light)' }}
        >
          <h4
            className="text-sm font-bold flex items-center gap-2"
            style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
          >
            <Calendar size={16} style={{ color: 'var(--color-primary)' }} />
            能量报告
          </h4>
          <PeriodToggle period={period} setPeriod={setPeriod} />
        </div>
        <div className="p-6 text-center">
          <BarChart3 className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--color-text-muted)' }} />
          <p className="text-sm" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>{periodLabel}还没有记录</p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>开始记录活动后，这里会生成你的能量报告</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ ...getCardStyle(), border: 'var(--border-light)' }}
    >
      {/* 标题栏 */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: 'var(--border-light)' }}
      >
        <h4
          className="text-sm font-bold flex items-center gap-2"
          style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
        >
          <Calendar size={16} style={{ color: 'var(--color-primary)' }} />
          {periodLabel}能量报告
        </h4>
        <PeriodToggle period={period} setPeriod={setPeriod} />
      </div>

      <div className="p-4 space-y-4">
        {/* 核心指标卡片 */}
        <div className="grid grid-cols-3 gap-3">
          {/* 平均能量 */}
          <div
            className="rounded-lg p-3"
            style={{ background: 'var(--color-bg-elevated)', border: 'var(--border-light)' }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <Zap size={14} style={{ color: 'var(--color-primary)' }} />
              <span className="text-[10px] font-medium" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-body)' }}>平均能量</span>
            </div>
            <div className="text-xl font-bold" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>{report.avgEnergy}</div>
            <span
              className="text-[9px] px-1.5 py-0.5 rounded-full"
              style={{ background: energyLevel.bg, color: energyLevel.color, fontFamily: 'var(--font-body)' }}
            >
              {energyLevel.label}
            </span>
          </div>

          {/* 平均专注度 */}
          <div
            className="rounded-lg p-3"
            style={{ background: 'var(--color-bg-elevated)', border: 'var(--border-light)' }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <Focus size={14} style={{ color: 'var(--color-accent)' }} />
              <span className="text-[10px] font-medium" style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-body)' }}>平均专注</span>
            </div>
            <div className="text-xl font-bold" style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-heading)' }}>{report.avgEngagement}</div>
            <span
              className="text-[9px] px-1.5 py-0.5 rounded-full"
              style={{ background: engagementLevel.bg, color: engagementLevel.color, fontFamily: 'var(--font-body)' }}
            >
              {engagementLevel.label}
            </span>
          </div>

          {/* 活动数量 */}
          <div
            className="rounded-lg p-3"
            style={{ background: 'var(--color-bg-elevated)', border: 'var(--border-light)' }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <BarChart3 size={14} style={{ color: 'var(--color-secondary)' }} />
              <span className="text-[10px] font-medium" style={{ color: 'var(--color-secondary)', fontFamily: 'var(--font-body)' }}>活动数</span>
            </div>
            <div className="text-xl font-bold" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>{report.totalEntries}</div>
            <span className="text-[9px]" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
              {period === 'week' ? '本周记录' : '本月记录'}
            </span>
          </div>
        </div>

        {/* 心流时间占比 */}
        <div
          className="rounded-lg p-3"
          style={{ background: 'var(--color-bg-elevated)', border: 'var(--border-light)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className="text-xs font-bold flex items-center gap-1.5"
              style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
            >
              <TrendingUp size={14} style={{ color: 'var(--color-primary)' }} />
              心流时间占比
            </span>
            <span
              className="text-sm font-bold"
              style={{
                color: report.flowTimeRatio >= 50 ? 'var(--color-primary)' : report.flowTimeRatio >= 30 ? 'var(--color-secondary)' : 'var(--color-error)',
                fontFamily: 'var(--font-heading)',
              }}
            >
              {report.flowTimeRatio}%
            </span>
          </div>
          <div className="w-full rounded-full h-2.5 mb-2" style={{ background: 'var(--color-bg)' }}>
            <div
              className="h-2.5 rounded-full transition-all duration-500"
              style={{ ...getFlowBarStyle(report.flowTimeRatio), width: `${Math.min(report.flowTimeRatio, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px]" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
            <span>低效区</span>
            <span>理想心流 50%+</span>
          </div>
        </div>

        {/* 每日能量分布 */}
        {report.dailyData && (
          <div
            className="rounded-lg p-3"
            style={{ background: 'var(--color-bg-elevated)', border: 'var(--border-light)' }}
          >
            <h5 className="text-xs font-bold mb-2" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>每日能量分布</h5>
            <div className="flex items-end gap-1 h-20">
              {report.dailyData.map((day, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full relative flex flex-col items-center" style={{ height: '60px' }}>
                    {/* 能量柱 */}
                    <div
                      className="w-full max-w-[16px] rounded-t transition-all duration-300"
                      style={{
                        background:
                          day.avgEnergy >= 7 ? 'var(--color-primary)' :
                          day.avgEnergy >= 4 ? 'var(--color-secondary)' :
                          day.count > 0 ? 'var(--color-error)' : 'var(--color-bg)',
                        height: `${day.count > 0 ? Math.max(day.avgEnergy * 6, 4) : 0}%`,
                        opacity: day.count > 0 ? 1 : 0.3,
                      }}
                    />
                  </div>
                  <span
                    className="text-[8px]"
                    style={{ color: day.count > 0 ? 'var(--color-text-secondary)' : 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
                  >
                    {day.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 活动分类排行 */}
        {report.topCategories.length > 0 && (
          <div>
            <h5 className="text-xs font-bold mb-2" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>活动分类统计</h5>
            <div className="space-y-1.5">
              {report.topCategories.slice(0, 5).map((cat, idx) => (
                <div key={cat.category} className="flex items-center gap-2">
                  <span className="text-[10px] w-4" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>{idx + 1}.</span>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded"
                    style={{ background: 'var(--color-bg-elevated)', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}
                  >
                    {cat.label}
                  </span>
                  <div className="flex-1 rounded-full h-1.5" style={{ background: 'var(--color-bg)' }}>
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{ background: 'var(--color-primary)', width: `${cat.percentage}%` }}
                    />
                  </div>
                  <span className="text-[10px] w-8 text-right" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}>{cat.count}次</span>
                  <span className="text-[10px] w-10 text-right" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                    能量{cat.avgEnergy}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 心流活动列表 */}
        {report.flowActivities.length > 0 && (
          <div>
            <h5 className="text-xs font-bold mb-2 flex items-center gap-1.5" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>
              <span style={{ color: 'var(--color-primary)' }}>&#9733;</span>
              心流活动
            </h5>
            <div className="flex flex-wrap gap-1.5">
              {report.flowActivities.map((name, idx) => (
                <span
                  key={idx}
                  className="text-[10px] px-2 py-1 rounded-full font-medium"
                  style={{ background: 'var(--color-bg-elevated)', color: 'var(--color-primary)', fontFamily: 'var(--font-body)' }}
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 建议 */}
        {report.suggestions.length > 0 && (
          <div
            className="rounded-lg p-3"
            style={{ background: 'var(--color-bg-elevated)', border: 'var(--border-light)' }}
          >
            <h5 className="text-xs font-bold mb-2" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>本周建议</h5>
            <ul className="space-y-1.5">
              {report.suggestions.map((s, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}>
                  <ChevronRight size={12} className="flex-shrink-0 mt-0.5" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* AI 能量分析 */}
        {aiConfigured && (
          <div className="mt-2">
            <AIButton onClick={handleAIAnalysis} loading={aiLoading} size="sm">
              AI 能量分析
            </AIButton>
          </div>
        )}
        {showAI && (
          <div className="mt-3 rounded-lg p-3" style={{ background: 'var(--color-bg-elevated)', border: 'var(--border-light)' }}>
            <AIStreamingText text={streamingText} loading={aiLoading} />
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * 周/月切换组件
 */
const PeriodToggle = ({ period, setPeriod }) => (
  <div className="flex rounded-lg p-0.5" style={{ background: 'var(--color-bg-elevated)' }}>
    <button
      onClick={() => setPeriod('week')}
      className="text-[10px] px-3 py-1 rounded-md transition-all"
      style={
        period === 'week'
          ? { background: 'var(--color-bg-card)', color: 'var(--color-primary)', boxShadow: 'var(--shadow-soft)', fontFamily: 'var(--font-body)', fontWeight: 600 }
          : { color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }
      }
    >
      周报
    </button>
    <button
      onClick={() => setPeriod('month')}
      className="text-[10px] px-3 py-1 rounded-md transition-all"
      style={
        period === 'month'
          ? { background: 'var(--color-bg-card)', color: 'var(--color-primary)', boxShadow: 'var(--shadow-soft)', fontFamily: 'var(--font-body)', fontWeight: 600 }
          : { color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }
      }
    >
      月报
    </button>
  </div>
);

export default JournalReport;
