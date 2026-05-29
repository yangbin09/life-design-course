import React, { createContext, useContext, useMemo } from 'react';
import { loadData } from '../utils/storage';

const AIContext = createContext(null);

/**
 * 全局 AI 上下文 Provider
 * 聚合所有用户数据，为 AI 提供完整的用户画像
 */
export const AIProvider = ({ children }) => {
  // 聚合所有模块数据
  const userData = useMemo(() => {
    const dashboard = {
      current: loadData('dashboard-current', { health: 60, work: 60, play: 60, love: 60 }),
      history: loadData('dashboard-history', []),
    };

    const journal = {
      entries: loadData('journal-entries', []),
    };

    const compass = {
      workView: loadData('compass-work-view', ''),
      lifeView: loadData('compass-life-view', ''),
      history: loadData('compass-history', []),
    };

    const odyssey = {
      plans: loadData('odyssey-plans', []),
      ratings: loadData('odyssey-ratings', []),
    };

    const prototype = {
      gravityProblems: loadData('proto-gravity', []),
      interviews: loadData('proto-interviews', []),
      microExperiences: loadData('proto-micro-exp', []),
    };

    const designThinking = {
      curiosities: loadData('dt-curiosities', []),
      reframes: loadData('dt-reframes', []),
      checkedDays: loadData('dt-checked-days', {}),
    };

    const journey = {
      milestones: loadData('journey-milestones', []),
      reviews: loadData('journey-annual-reviews', []),
      stories: loadData('journey-stories', []),
    };

    return { dashboard, journal, compass, odyssey, prototype, designThinking, journey };
  }, []); // 只在 mount 时读取一次，避免频繁 re-render

  /**
   * 构建用户画像摘要（注入 system prompt）
   */
  const buildUserSummary = useMemo(() => {
    const parts = [];

    // 仪表盘
    const { current, history } = userData.dashboard;
    parts.push(`【人生仪表盘】健康:${current.health} 工作:${current.work} 娱乐:${current.play} 爱:${current.love}`);
    if (history.length > 0) {
      const latest = history[history.length - 1];
      parts.push(`最近评估时间: ${latest.timestamp || '未知'}, 共 ${history.length} 次历史记录`);
    }

    // 好时光日志
    const { entries } = userData.journal;
    if (entries.length > 0) {
      const flowEntries = entries.filter(e => e.energy >= 7 && e.engagement >= 7);
      const drainEntries = entries.filter(e => e.energy <= 3);
      parts.push(`【好时光日志】共 ${entries.length} 条记录`);
      if (flowEntries.length > 0) {
        parts.push(`心流活动(${flowEntries.length}个): ${flowEntries.slice(0, 5).map(e => e.name).join('、')}`);
      }
      if (drainEntries.length > 0) {
        parts.push(`能量消耗活动: ${drainEntries.slice(0, 3).map(e => e.name).join('、')}`);
      }
    }

    // 指南针
    const { workView, lifeView } = userData.compass;
    if (workView) parts.push(`【工作观】${workView.slice(0, 100)}...`);
    if (lifeView) parts.push(`【生命观】${lifeView.slice(0, 100)}...`);

    // 奥德赛计划
    const { plans, ratings } = userData.odyssey;
    if (plans.length > 0) {
      parts.push(`【奥德赛计划】${plans.map((p, i) => `Plan${i + 1}:${p.title}`).join(', ')}`);
    }

    // 原型设计
    const { interviews, microExperiences } = userData.prototype;
    if (interviews.length > 0) parts.push(`【访谈记录】${interviews.length} 个`);
    if (microExperiences.length > 0) parts.push(`【微体验】${microExperiences.length} 个`);

    // 旅程
    const { milestones, stories } = userData.journey;
    if (milestones.length > 0) parts.push(`【里程碑】${milestones.length} 个`);
    if (stories.length > 0) parts.push(`【故事】${stories.length} 篇`);

    return parts.join('\n');
  }, [userData]);

  /**
   * 获取带用户画像的 system prompt
   */
  const getSystemPromptWithContext = (basePrompt) => {
    return `${basePrompt}

=== 用户数据画像 ===
${buildUserSummary}
=================`;
  };

  const value = {
    userData,
    buildUserSummary,
    getSystemPromptWithContext,
  };

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
};

export const useAIContext = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAIContext must be used within AIProvider');
  }
  return context;
};

export default AIContext;
