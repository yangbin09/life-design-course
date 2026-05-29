import React, { useState } from 'react';
import { Navigation, Map, CalendarDays, BookOpen } from 'lucide-react';
import useJourney from '../../hooks/useJourney';
import useAI from '../../hooks/useAI';
import AIButton from '../AI/AIButton';
import AIStreamingText from '../AI/AIStreamingText';
import { ANNUAL_REVIEW_PROMPT } from '../../data/aiPrompts';
import JourneyMap from './JourneyMap';
import AnnualReview from './AnnualReview';
import StoryLibrary from './StoryLibrary';

const JourneyContainer = () => {
  const {
    milestones,
    completedMilestones,
    annualReviews,
    annualReviewTemplate,
    stories,
    activeTab,
    progress,
    setActiveTab,
    toggleMilestone,
    addAnnualReview,
    updateAnnualReview,
    addStory,
    updateStory,
    removeStory,
  } = useJourney();

  const [aiResult, setAiResult] = useState('');
  const [showAI, setShowAI] = useState(false);
  const { loading, streamingText, generateStreamingWithTemplate } = useAI();

  const tabs = [
    { id: 'map', label: '旅程地图', icon: <Map size={16} /> },
    { id: 'review', label: '年度回顾', icon: <CalendarDays size={16} /> },
    { id: 'stories', label: '故事库', icon: <BookOpen size={16} /> },
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

      {/* AI 生成回顾 */}
      <div className="flex flex-col items-center gap-3">
        <AIButton
          loading={loading}
          onClick={() => {
            setShowAI(true);
            setAiResult('');
            generateStreamingWithTemplate(ANNUAL_REVIEW_PROMPT, {
              dashboard: '暂无数据',
              journalHighlights: '暂无数据',
              milestones: JSON.stringify(completedMilestones),
              stories: JSON.stringify(stories?.slice(-5) || []),
            });
          }}
        >
          AI 生成回顾
        </AIButton>
        {showAI && (
          <div className="w-full max-w-2xl p-4 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: 'var(--border-light)' }}>
            <AIStreamingText text={streamingText} loading={loading} />
          </div>
        )}
      </div>

        {/* 内容区域 */}
        {activeTab === 'map' && (
          <JourneyMap
            milestones={milestones}
            completedMilestones={completedMilestones}
            onToggle={toggleMilestone}
            progress={progress}
          />
        )}

        {activeTab === 'review' && (
          <AnnualReview
            reviews={annualReviews}
            template={annualReviewTemplate}
            onAdd={addAnnualReview}
            onUpdate={updateAnnualReview}
          />
        )}

        {activeTab === 'stories' && (
          <StoryLibrary
            stories={stories}
            onAdd={addStory}
            onUpdate={updateStory}
            onRemove={removeStory}
          />
        )}
    </div>
  );
};

export default JourneyContainer;
