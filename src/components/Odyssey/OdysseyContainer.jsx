import React, { useState } from 'react';
import { Map, RefreshCw, Lightbulb, BarChart2, Clock, Layers, GitCompare, PenTool } from 'lucide-react';
import { useOdyssey } from '../../hooks/useOdyssey';
import { useOdysseyTimeline } from '../../hooks/useOdysseyTimeline';
import useAI from '../../hooks/useAI';
import OdysseyPlanCard from './OdysseyPlanCard';
import OdysseyTimeline from './OdysseyTimeline';
import OdysseyResources from './OdysseyResources';
import OdysseyRating from './OdysseyRating';
import OdysseyCompare from './OdysseyCompare';
import OdysseyCanvas from './OdysseyCanvas';
import AIButton from '../AI/AIButton';
import AIStreamingText from '../AI/AIStreamingText';
import { ODYSSEY_GENERATE_PROMPT } from '../../data/aiPrompts';
import { getCardStyle, getTitleStyle, getDescStyle } from '../../styles/components';

const planIcons = [Map, RefreshCw, Lightbulb];

const tabConfig = [
  { id: 'plans', label: '计划总览', icon: Layers },
  { id: 'canvas', label: '详细规划', icon: PenTool },
  { id: 'timeline', label: '时间线', icon: Clock },
  { id: 'resources', label: '资源盘点', icon: BarChart2 },
  { id: 'compare', label: '计划对比', icon: GitCompare }
];

const OdysseyContainer = () => {
  const {
    plans, ratings,
    updatePlan, updateRating, updateResources,
    addTimelineNode, addMilestone, addObstacle,
    getComparisonData, getResourceGapReport
  } = useOdyssey();

  const {
    timelineData, addNode, updateNode, removeNode,
    getTimeline, getAllTimelines, resetTimeline, getTimelineStats
  } = useOdysseyTimeline();

  const { loading: aiLoading, streamingText, generateStreamingWithTemplate, clearState } = useAI();
  const [aiResult, setAiResult] = useState('');
  const [showAI, setShowAI] = useState(false);

  const [activeTab, setActiveTab] = useState('plans');
  const [activePlan, setActivePlan] = useState(0);

  const handleAIGenerate = async () => {
    setShowAI(true);
    setAiResult('');
    clearState();
    try {
      const result = await generateStreamingWithTemplate(ODYSSEY_GENERATE_PROMPT, {
        context: '用户正在设计人生计划',
        planType: activePlan === 0 ? 'Plan A' : activePlan === 1 ? 'Plan B' : 'Plan C',
      });
      setAiResult(result);
    } catch (err) {
      setAiResult('生成失败：' + err.message);
    }
  };

  // 统一使用温暖色调的计划颜色
  const planColors = [
    { bg: 'var(--color-bg)', border: 'var(--color-primary)', accent: 'var(--color-primary)', light: 'var(--color-bg-elevated)' },
    { bg: 'var(--color-bg)', border: 'var(--color-secondary)', accent: 'var(--color-secondary)', light: 'var(--color-bg-elevated)' },
    { bg: 'var(--color-bg)', border: 'var(--color-accent)', accent: 'var(--color-accent)', light: 'var(--color-bg-elevated)' },
  ];

  const currentPlan = plans[activePlan];
  const currentColor = planColors[activePlan] || planColors[0];

  return (
    <div className="space-y-6">
      {/* 计划选择导航 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan, idx) => {
          const Icon = planIcons[idx];
          const colors = planColors[idx];
          return (
            <button
              key={plan.id}
              onClick={() => setActivePlan(idx)}
              className="p-4 rounded-xl text-left transition-all duration-200 cursor-pointer"
              style={{
                background: activePlan === idx ? colors.light : 'var(--color-bg-card)',
                border: activePlan === idx ? `2px solid ${colors.border}` : 'var(--border-light)',
                boxShadow: activePlan === idx ? 'var(--shadow-medium)' : 'var(--shadow-soft)',
                transform: activePlan === idx ? 'scale(1.02)' : 'none',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    background: activePlan === idx ? colors.border : 'var(--color-bg-elevated)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <Icon
                    size={20}
                    style={{ color: activePlan === idx ? 'white' : 'var(--color-text-muted)' }}
                  />
                </div>
                <div>
                  <div
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{
                      fontFamily: 'var(--font-body)',
                      color: activePlan === idx ? colors.accent : 'var(--color-text-muted)',
                    }}
                  >
                    Plan {idx + 1}
                  </div>
                  <div
                    className="font-bold text-sm"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      color: activePlan === idx ? 'var(--color-text)' : 'var(--color-text-secondary)',
                    }}
                  >
                    {plan.title.split('：')[1]}
                  </div>
                </div>
              </div>
              {activePlan === idx && (
                <div
                  className="h-1 w-16 rounded-full mt-3"
                  style={{ background: colors.border }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* 功能标签页 */}
      <div
        className="flex flex-wrap gap-2 p-2 rounded-xl"
        style={{
          ...getCardStyle(),
          padding: '8px',
        }}
      >
        {tabConfig.map(tab => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer"
              style={{
                fontFamily: 'var(--font-body)',
                background: activeTab === tab.id ? 'var(--color-primary)' : 'transparent',
                color: activeTab === tab.id ? 'white' : 'var(--color-text-muted)',
                boxShadow: activeTab === tab.id ? 'var(--shadow-warm)' : 'none',
              }}
            >
              <TabIcon size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* AI 计划生成 */}
      <div className="flex flex-col items-center gap-4">
        <AIButton onClick={handleAIGenerate} loading={aiLoading}>
          AI 生成计划建议
        </AIButton>
        {showAI && (
          <div
            className="w-full p-4 rounded-xl"
            style={{
              background: 'var(--color-bg-card)',
              border: 'var(--border-light)',
            }}
          >
            <AIStreamingText text={streamingText || aiResult} loading={aiLoading} />
          </div>
        )}
      </div>

      {/* 内容区域 */}
      <div className="min-h-[400px]">
        {activeTab === 'plans' && (
          <OdysseyPlanCard
            plan={currentPlan}
            index={activePlan}
            colors={currentColor}
            onUpdate={(updates) => updatePlan(currentPlan.id, updates)}
          />
        )}

        {activeTab === 'canvas' && (
          <OdysseyCanvas
            plan={currentPlan}
            colors={currentColor}
            addMilestone={addMilestone}
            addObstacle={addObstacle}
            onUpdate={(updates) => updatePlan(currentPlan.id, updates)}
          />
        )}

        {activeTab === 'timeline' && (
          <OdysseyTimeline
            plan={currentPlan}
            planIndex={activePlan}
            timeline={getTimeline(currentPlan.id)}
            colors={currentColor}
            onAddNode={(node) => addNode(currentPlan.id, node)}
            onUpdateNode={(nodeId, updates) => updateNode(currentPlan.id, nodeId, updates)}
            onRemoveNode={(nodeId) => removeNode(currentPlan.id, nodeId)}
            onReset={() => resetTimeline(currentPlan.id)}
            stats={getTimelineStats(currentPlan.id)}
          />
        )}

        {activeTab === 'resources' && (
          <OdysseyResources
            plan={currentPlan}
            colors={currentColor}
            onUpdateResources={(type, value) => updateResources(currentPlan.id, type, value)}
            gapReport={getResourceGapReport(currentPlan.id)}
          />
        )}

        {activeTab === 'compare' && (
          <OdysseyCompare
            plans={plans}
            ratings={ratings}
            comparisonData={getComparisonData()}
            colorMap={planColors}
          />
        )}
      </div>
    </div>
  );
};

export default OdysseyContainer;
