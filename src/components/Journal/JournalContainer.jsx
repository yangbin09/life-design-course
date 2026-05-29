import React, { useState } from 'react';
import { Battery, BarChart3, Briefcase, Map, ChevronDown, ChevronUp, Trash2, Sparkles } from 'lucide-react';
import { useJournal } from '../../hooks/useJournal';
import useAI from '../../hooks/useAI';
import AIButton from '../AI/AIButton';
import AIStreamingText from '../AI/AIStreamingText';
import { JOURNAL_ANALYSIS_PROMPT } from '../../data/aiPrompts';
import JournalEntryForm from './JournalEntryForm';
import JournalList from './JournalList';
import JournalEnergyMap from './JournalEnergyMap';
import JournalReport from './JournalReport';
import JournalWorkAnalysis from './JournalWorkAnalysis';
import { getCardStyle } from '../../styles/components';

/**
 * 好时光日志主容器
 * 集成日志输入、列表、能量地图、报告和工作分析
 */
const JournalContainer = () => {
  const {
    entries,
    addEntry,
    updateEntry,
    deleteEntry,
    clearEntries,
    getEnergyMapData,
    generateReport,
    getWorkAnalysis
  } = useJournal();

  const [activeTab, setActiveTab] = useState('list'); // list | map | report | work
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showAIResult, setShowAIResult] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  const { generateStreamingWithTemplate, streamingText, loading: aiLoading, isConfigured: aiConfigured } = useAI();

  const tabs = [
    { id: 'list', label: '活动记录', icon: <Battery size={14} /> },
    { id: 'map', label: '能量地图', icon: <Map size={14} /> },
    { id: 'report', label: '能量报告', icon: <BarChart3 size={14} /> },
    { id: 'work', label: '工作分析', icon: <Briefcase size={14} /> }
  ];

  const handleClear = () => {
    clearEntries();
    setShowClearConfirm(false);
  };

  // AI 总结本周
  const handleWeeklyAI = async () => {
    setShowAIResult(true);
    setAiResult(null);
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recentEntries = entries.filter(e => new Date(e.date).getTime() >= sevenDaysAgo);
    try {
      const result = await generateStreamingWithTemplate(JOURNAL_ANALYSIS_PROMPT, {
        entries: JSON.stringify(recentEntries.length > 0 ? recentEntries : entries.slice(-10)),
      });
      setAiResult(result);
    } catch (err) {
      // error is handled by useAI hook
    }
  };

  return (
    <div className="space-y-4">
      {/* 日志输入表单 */}
      <JournalEntryForm onAdd={addEntry} />

      {/* 标签页导航 */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          ...getCardStyle(),
          border: 'var(--border-light)',
        }}
      >
        <div
          className="flex"
          style={{ borderBottom: 'var(--border-light)' }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 py-3 px-2 flex items-center justify-center gap-1.5 text-xs font-medium transition-all duration-200 cursor-pointer"
              style={{
                fontFamily: 'var(--font-body)',
                background: activeTab === tab.id ? 'var(--color-bg)' : 'transparent',
                color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-muted)',
                borderBottom: activeTab === tab.id ? '2px solid var(--color-primary)' : '2px solid transparent',
              }}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 标签页内容 */}
        <div className="p-5">
          {activeTab === 'list' && (
            <JournalList
              entries={entries}
              onUpdate={updateEntry}
              onDelete={deleteEntry}
            />
          )}

          {activeTab === 'map' && (
            <JournalEnergyMap
              data={getEnergyMapData}
              entries={entries}
            />
          )}

          {activeTab === 'report' && (
            <JournalReport generateReport={generateReport} entries={entries} />
          )}

          {activeTab === 'work' && (
            <JournalWorkAnalysis workAnalysis={getWorkAnalysis} />
          )}
        </div>
      </div>

      {/* AI 周总结结果（可折叠） */}
      {showAIResult && (
        <div
          className="rounded-xl p-4"
          style={{
            background: 'linear-gradient(135deg, rgba(198,123,92,0.08), rgba(181,101,29,0.08))',
            border: '1px solid rgba(198,123,92,0.2)',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold" style={{ color: 'var(--color-accent)' }}>AI 本周总结</p>
            <button
              onClick={() => setShowAIResult(false)}
              className="text-xs cursor-pointer hover:opacity-80"
              style={{ color: 'var(--color-text-muted)' }}
            >
              收起
            </button>
          </div>
          {aiLoading && !streamingText && (
            <p className="text-xs animate-pulse" style={{ color: 'var(--color-text-muted)' }}>AI 分析中...</p>
          )}
          <AIStreamingText text={streamingText} loading={aiLoading} />
        </div>
      )}

      {/* 底部操作栏 */}
      {entries.length > 0 && (
        <div className="flex items-center justify-between px-2">
          <span
            className="text-xs"
            style={{ color: 'var(--color-text-muted)' }}
          >
            共 {entries.length} 条记录
          </span>
          <div className="flex items-center gap-3">
            {aiConfigured && (
              <button
                onClick={handleWeeklyAI}
                disabled={aiLoading}
                className="text-xs flex items-center gap-1 transition-colors duration-200 hover:opacity-80 cursor-pointer disabled:opacity-50"
                style={{ color: 'var(--color-accent)' }}
              >
                <Sparkles size={11} />
                AI 总结本周
              </button>
            )}
            {!showClearConfirm ? (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="text-xs flex items-center gap-1 transition-colors duration-200 hover:opacity-80"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <Trash2 size={11} />
                清空所有
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: 'var(--color-error)' }}>
                  确定清空？
                </span>
                <button
                  onClick={handleClear}
                  className="text-xs text-white px-2 py-0.5 rounded transition-colors duration-200"
                  style={{ background: 'var(--color-error)' }}
                >
                  确定
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="text-xs transition-colors duration-200 hover:opacity-80"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  取消
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalContainer;
