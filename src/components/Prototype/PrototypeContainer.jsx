import React, { useState } from 'react';
import { Layers, Anchor, Users, Beaker } from 'lucide-react';
import usePrototype from '../../hooks/usePrototype';
import useAI from '../../hooks/useAI';
import AIButton from '../AI/AIButton';
import AIStreamingText from '../AI/AIStreamingText';
import { GRAVITY_REFRAME_PROMPT } from '../../data/aiPrompts';
import GravityProblem from './GravityProblem';
import InterviewPrep from './InterviewPrep';
import MicroExperience from './MicroExperience';

const PrototypeContainer = () => {
  const {
    gravityQuestions,
    gravityAssessments,
    interviews,
    microExperiences,
    activeTab,
    setActiveTab,
    addGravityAssessment,
    removeGravityAssessment,
    addInterview,
    updateInterview,
    removeInterview,
    addMicroExperience,
    updateMicroExperience,
    removeMicroExperience,
  } = usePrototype();

  const [aiResult, setAiResult] = useState('');
  const [showAI, setShowAI] = useState(false);
  const { loading, streamingText, generateStreamingWithTemplate } = useAI();

  const tabs = [
    { id: 'gravity', label: '重力问题', icon: <Anchor size={16} /> },
    { id: 'interview', label: '访谈准备', icon: <Users size={16} /> },
    { id: 'micro', label: '微体验', icon: <Beaker size={16} /> },
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

      {/* AI 问题重构 */}
      <div className="flex flex-col items-center gap-3">
        <AIButton
          loading={loading}
          onClick={() => {
            setShowAI(true);
            setAiResult('');
            generateStreamingWithTemplate(GRAVITY_REFRAME_PROMPT, { problem: '用户正在探索重力问题' });
          }}
        >
          AI 问题重构
        </AIButton>
        {showAI && (
          <div className="w-full max-w-2xl p-4 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: 'var(--border-light)' }}>
            <AIStreamingText text={streamingText} loading={loading} />
          </div>
        )}
      </div>

        {/* 内容区域 */}
        {activeTab === 'gravity' && (
          <GravityProblem
            gravityQuestions={gravityQuestions}
            assessments={gravityAssessments}
            onAdd={addGravityAssessment}
            onRemove={removeGravityAssessment}
          />
        )}

        {activeTab === 'interview' && (
          <InterviewPrep
            interviews={interviews}
            onAdd={addInterview}
            onUpdate={updateInterview}
            onRemove={removeInterview}
          />
        )}

        {activeTab === 'micro' && (
          <MicroExperience
            experiences={microExperiences}
            onAdd={addMicroExperience}
            onUpdate={updateMicroExperience}
            onRemove={removeMicroExperience}
          />
        )}
    </div>
  );
};

export default PrototypeContainer;
