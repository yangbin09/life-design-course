import React, { useState } from 'react';
import {
  Activity,
  Save,
  Trash2,
  BarChart2,
  TrendingUp,
  FileText,
  ArrowLeftRight,
  ChevronDown,
  ChevronUp,
  CheckCircle
} from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import { useDashboardCompare } from '../../hooks/useDashboardCompare';
import useAI from '../../hooks/useAI';
import AIButton from '../AI/AIButton';
import AIStreamingText from '../AI/AIStreamingText';
import { DASHBOARD_DIAGNOSIS_PROMPT } from '../../data/aiPrompts';
import { useAIContext } from '../../contexts/AIContext';
import DashboardSlider from './DashboardSlider';
import DashboardChart, { DashboardRadar } from './DashboardChart';
import DashboardDiagnosis from './DashboardDiagnosis';
import DashboardTrend from './DashboardTrend';
import DashboardCompare from './DashboardCompare';

// Tab 定义
const tabs = [
  { key: 'overview', label: '总览', icon: BarChart2 },
  { key: 'trend', label: '趋势', icon: TrendingUp },
  { key: 'diagnosis', label: '诊断', icon: FileText },
  { key: 'compare', label: '对比', icon: ArrowLeftRight }
];

/**
 * 仪表盘主容器组件
 * 整合滑块、图表、诊断报告、趋势追踪和对比功能
 */
const DashboardContainer = () => {
  const {
    currentData,
    history,
    updateDimension,
    saveToHistory,
    getTrendData,
    generateDiagnosis,
    clearHistory
  } = useDashboard();

  const compareHook = useDashboardCompare();
  const { generateStreamingWithTemplate, streamingText, loading: aiLoading, isConfigured: aiConfigured } = useAI();
  const { getSystemPromptWithContext } = useAIContext();

  const [activeTab, setActiveTab] = useState('overview');
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | null
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [showAI, setShowAI] = useState(false);

  const diagnosis = generateDiagnosis();

  // 保存当前评估
  const handleSave = () => {
    saveToHistory();
    setSaveStatus('success');
    setTimeout(() => setSaveStatus(null), 2000);
    // 保存后自动触发 AI 分析
    if (aiConfigured) {
      handleAIDiagnosis();
    }
  };

  // 清空历史
  const handleClear = () => {
    clearHistory();
    setShowClearConfirm(false);
  };

  // AI 深度分析
  const handleAIDiagnosis = async () => {
    setShowAI(true);
    setAiResult(null);
    try {
      const result = await generateStreamingWithTemplate(DASHBOARD_DIAGNOSIS_PROMPT, {
        health: currentData.health,
        work: currentData.work,
        play: currentData.play,
        love: currentData.love,
        history: JSON.stringify(history.slice(-5)),
      });
      setAiResult(result);
    } catch (err) {
      // error is handled by useAI hook
    }
  };

  return (
    <section
      className="overflow-hidden"
      style={{
        background: 'var(--color-bg-card)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-medium)',
        border: 'var(--border-light)',
      }}
    >
      {/* 头部 */}
      <div
        className="px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3"
        style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' }}
      >
        <h3
          className="text-lg font-bold flex items-center gap-2 text-white"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          <Activity size={20} />
          人生仪表盘
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-3 py-1 rounded-full" style={{ color: 'rgba(255,255,255,0.7)', background: 'rgba(181,101,29,0.5)' }}>
            {history.length} 条记录
          </span>
        </div>
      </div>

      {/* Tab 导航 */}
      <div style={{ borderBottom: 'var(--border-light)', background: 'var(--color-bg)' }}>
        <div className="flex overflow-x-auto">
          {tabs.map(tab => {
            const IconComp = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="flex items-center gap-1.5 px-4 py-3 text-xs font-bold whitespace-nowrap transition-colors cursor-pointer"
                style={{
                  fontFamily: 'var(--font-body)',
                  borderBottom: activeTab === tab.key ? '2px solid var(--color-primary)' : '2px solid transparent',
                  color: activeTab === tab.key ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  background: activeTab === tab.key ? 'var(--color-bg-card)' : 'transparent',
                }}
              >
                <IconComp size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="p-6 md:p-8">
        {/* 总览 Tab */}
        {activeTab === 'overview' && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* 左侧：滑块控制 */}
            <div className="lg:w-1/2">
              <p className="text-sm mb-5" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}>
                诚实地拖动滑块，评估你当前的能量状态。这能帮助你识别需要重点"设计"的领域。
              </p>
              <DashboardSlider
                data={currentData}
                onChange={updateDimension}
              />

              {/* 操作按钮 */}
              <div className="flex gap-2 mt-6">
                <button
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-1.5 text-sm font-bold py-2.5 rounded-lg transition-all cursor-pointer"
                  style={{
                    fontFamily: 'var(--font-body)',
                    background: saveStatus === 'success' ? 'rgba(212,196,168,0.3)' : 'var(--color-primary)',
                    color: saveStatus === 'success' ? 'var(--color-accent)' : 'white',
                    border: saveStatus === 'success' ? '1px solid var(--color-secondary)' : 'none',
                  }}
                >
                  {saveStatus === 'success' ? (
                    <>
                      <CheckCircle size={16} /> 已保存
                    </>
                  ) : (
                    <>
                      <Save size={16} /> 保存本次评估
                    </>
                  )}
                </button>
                {history.length > 0 && (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="flex items-center justify-center gap-1.5 text-sm font-bold py-2.5 px-4 rounded-lg transition-colors cursor-pointer"
                    style={{
                      fontFamily: 'var(--font-body)',
                      border: 'var(--border-light)',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              {/* 清空确认 */}
              {showClearConfirm && (
                <div className="mt-3 rounded-lg p-3" style={{ background: 'rgba(198,123,92,0.1)', border: '1px solid rgba(198,123,92,0.3)' }}>
                  <p className="text-xs font-medium mb-2" style={{ color: 'var(--color-error)' }}>
                    确定要清空所有 {history.length} 条历史记录吗？此操作不可撤销。
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleClear}
                      className="text-xs font-bold text-white px-3 py-1.5 rounded transition-colors cursor-pointer"
                      style={{ background: 'var(--color-error)' }}
                    >
                      确认清空
                    </button>
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="text-xs font-bold px-3 py-1.5 rounded transition-colors cursor-pointer"
                      style={{ background: 'var(--color-bg-card)', color: 'var(--color-text-secondary)', border: 'var(--border-light)' }}
                    >
                      取消
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 右侧：图表和快速诊断 */}
            <div className="lg:w-1/2 space-y-6">
              {/* 柱状图 */}
              <div className="rounded-xl p-5" style={{ background: 'var(--color-bg-elevated)', border: 'var(--border-light)' }}>
                <h4 className="text-sm font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>能量概览</h4>
                <DashboardChart data={currentData} height={160} />
              </div>

              {/* 雷达图 + 快速反馈 */}
              <div className="rounded-xl p-5" style={{ background: 'var(--color-bg-elevated)', border: 'var(--border-light)' }}>
                <h4 className="text-sm font-bold mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>能量分布</h4>
                <DashboardRadar data={currentData} size={160} />
              </div>

              {/* 快速反馈 */}
              <div className="rounded-xl p-4" style={{ background: 'linear-gradient(135deg, rgba(198,123,92,0.08), rgba(181,101,29,0.08))', border: '1px solid rgba(198,123,92,0.2)' }}>
                <h4 className="text-sm font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>快速反馈</h4>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}>
                  {diagnosis.balance === 'balanced'
                    ? '你的生活状态非常平衡！现在的挑战是如何保持这种状态并在细节上微调。'
                    : `你的${diagnosis.lowDimensions.join('和')}储量较低。设计思维告诉我们：不要试图一次解决所有问题，先从其中一个小点开始，做一个微小的改变。`}
                </p>
                {/* AI 分析结果内联展示 */}
                {(showAI || aiLoading) && (
                  <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(198,123,92,0.15)' }}>
                    <p className="text-xs font-bold mb-1.5" style={{ color: 'var(--color-accent)' }}>AI 深度分析</p>
                    {aiLoading && !streamingText && (
                      <p className="text-xs animate-pulse" style={{ color: 'var(--color-text-muted)' }}>AI 分析中...</p>
                    )}
                    <AIStreamingText text={streamingText} loading={aiLoading} />
                  </div>
                )}
                {aiConfigured && !showAI && !aiLoading && (
                  <div className="mt-3">
                    <AIButton onClick={handleAIDiagnosis} loading={false} size="sm">
                      AI 深度分析
                    </AIButton>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 趋势 Tab */}
        {activeTab === 'trend' && (
          <DashboardTrend
            history={history}
            getTrendData={getTrendData}
          />
        )}

        {/* 诊断 Tab */}
        {activeTab === 'diagnosis' && (
          <DashboardDiagnosis
            data={currentData}
            diagnosis={diagnosis}
            history={history}
          />
        )}

        {/* 对比 Tab */}
        {activeTab === 'compare' && (
          <DashboardCompare
            selfData={currentData}
            compareHook={compareHook}
          />
        )}
      </div>
    </section>
  );
};

export default DashboardContainer;
