import React, { useState } from 'react';
import { Compass, PenTool, Target } from 'lucide-react';
import useCompass from '../../hooks/useCompass';
import useAI from '../../hooks/useAI';
import CompassWriting from './CompassWriting';
import CompassAlignment from './CompassAlignment';
import AIButton from '../AI/AIButton';
import AIStreamingText from '../AI/AIStreamingText';
import { COMPASS_ANALYSIS_PROMPT } from '../../data/aiPrompts';
import { getCardStyle, getButtonStyle, getTitleStyle } from '../../styles/components';

const CompassContainer = () => {
  const {
    workView,
    lifeView,
    history,
    alignmentScores,
    activeTab,
    alignmentQuestions,
    setActiveTab,
    updateWorkView,
    updateLifeView,
    saveVersion,
    calculateAlignment,
    resetCompass,
  } = useCompass();

  const { loading: aiLoading, streamingText, generateStreamingWithTemplate, clearState } = useAI();
  const [aiResult, setAiResult] = useState('');
  const [showAI, setShowAI] = useState(false);

  const handleAIAnalysis = async () => {
    setShowAI(true);
    setAiResult('');
    clearState();
    try {
      const result = await generateStreamingWithTemplate(COMPASS_ANALYSIS_PROMPT, {
        workView: workView || '未填写',
        lifeView: lifeView || '未填写',
      });
      setAiResult(result);
    } catch (err) {
      setAiResult('分析失败：' + err.message);
    }
  };

  const tabs = [
    { id: 'writing', label: '书写', icon: <PenTool size={16} /> },
    { id: 'alignment', label: '一致性检测', icon: <Target size={16} /> },
  ];

  return (
    <div className="space-y-6">
      {/* Tab 导航 */}
      <div className="flex gap-2 justify-center">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer"
            style={{
              fontFamily: 'var(--font-body)',
              background: activeTab === tab.id ? 'var(--color-bg-card)' : 'var(--color-bg-elevated)',
              color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              boxShadow: activeTab === tab.id ? 'var(--shadow-soft)' : 'none',
              border: activeTab === tab.id ? 'var(--border-warm)' : 'var(--border-light)',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      {activeTab === 'writing' && (
        <CompassWriting
          workView={workView}
          lifeView={lifeView}
          onUpdateWork={updateWorkView}
          onUpdateLife={updateLifeView}
          onSaveVersion={saveVersion}
          history={history}
        />
      )}

      {activeTab === 'alignment' && (
        <CompassAlignment
          alignmentQuestions={alignmentQuestions}
          alignmentScores={alignmentScores}
          onCalculate={calculateAlignment}
        />
      )}

      {/* AI 一致性分析 */}
      <div className="flex flex-col items-center gap-4 pt-4">
        <AIButton onClick={handleAIAnalysis} loading={aiLoading}>
          AI 一致性分析
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

      {/* 底部重置 */}
      <div
        className="text-center mt-8 pt-6"
        style={{ borderTop: 'var(--border-light)' }}
      >
        <button
          onClick={resetCompass}
          className="text-sm transition-colors duration-200 hover:opacity-80"
          style={{ color: 'var(--color-text-muted)' }}
        >
          重置所有指南针数据
        </button>
      </div>
    </div>
  );
};

export default CompassContainer;
