import React, { useState } from 'react';
import { Zap, Calendar, Sparkles, RefreshCw } from 'lucide-react';
import useDesignThinking from '../../hooks/useDesignThinking';
import useAI from '../../hooks/useAI';
import AIButton from '../AI/AIButton';
import AIStreamingText from '../AI/AIStreamingText';
import { DESIGN_THINKING_PROMPT } from '../../data/aiPrompts';
import PracticeCalendar from './PracticeCalendar';
import CuriosityBox from './CuriosityBox';
import ReframeTrainer from './ReframeTrainer';

const DesignThinkingContainer = () => {
  const {
    practicePlan,
    categoryLabels,
    checkedDays,
    curiosities,
    reframes,
    activeTab,
    progress,
    categoryProgress,
    setActiveTab,
    toggleDay,
    addCuriosity,
    removeCuriosity,
    drawRandomCuriosity,
    addReframe,
    removeReframe,
  } = useDesignThinking();

  const [aiResult, setAiResult] = useState('');
  const [showAI, setShowAI] = useState(false);
  const { loading, streamingText, generateStreamingWithTemplate } = useAI();

  const tabs = [
    { id: 'calendar', label: '练习日历', icon: <Calendar size={16} /> },
    { id: 'curiosity', label: '好奇心收集箱', icon: <Sparkles size={16} /> },
    { id: 'reframe', label: '重构训练', icon: <RefreshCw size={16} /> },
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
              background: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-bg-elevated)',
              color: activeTab === tab.id ? 'white' : 'var(--color-text-secondary)',
              boxShadow: activeTab === tab.id ? 'var(--shadow-warm)' : 'none',
              border: activeTab === tab.id ? 'none' : 'var(--border-light)',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* AI 练习引导 */}
      <div className="flex flex-col items-center gap-3">
        <AIButton
          loading={loading}
          onClick={() => {
            setShowAI(true);
            setAiResult('');
            generateStreamingWithTemplate(DESIGN_THINKING_PROMPT, { exerciseType: activeTab, progress: `已完成 ${progress}%` });
          }}
        >
          AI 练习引导
        </AIButton>
        {showAI && (
          <div className="w-full max-w-2xl p-4 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: 'var(--border-light)' }}>
            <AIStreamingText text={streamingText} loading={loading} />
          </div>
        )}
      </div>

        {/* 内容区域 */}
        {activeTab === 'calendar' && (
          <PracticeCalendar
            practicePlan={practicePlan}
            categoryLabels={categoryLabels}
            checkedDays={checkedDays}
            onToggleDay={toggleDay}
            progress={progress}
            categoryProgress={categoryProgress}
          />
        )}

        {activeTab === 'curiosity' && (
          <CuriosityBox
            curiosities={curiosities}
            onAdd={addCuriosity}
            onRemove={removeCuriosity}
            onDrawRandom={drawRandomCuriosity}
          />
        )}

        {activeTab === 'reframe' && (
          <ReframeTrainer
            reframes={reframes}
            onAdd={addReframe}
            onRemove={removeReframe}
          />
        )}
    </div>
  );
};

export default DesignThinkingContainer;
