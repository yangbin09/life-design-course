import { useCallback } from 'react';
import useLocalStorage from './useLocalStorage';
import { generateId, getTimestamp } from '../utils/storage';

const JOURNEY_MILESTONES = [
  { id: 'm1', title: '认识设计思维', description: '理解人生可以被设计', module: 'dashboard' },
  { id: 'm2', title: '评估人生仪表盘', description: '诚实评估健康/工作/娱乐/爱', module: 'dashboard' },
  { id: 'm3', title: '发现能量来源', description: '通过好时光日志找到心流', module: 'dashboard' },
  { id: 'm4', title: '校准指南针', description: '书写工作观和人生观', module: 'compass' },
  { id: 'm5', title: '检测一致性', description: '确认工作观与人生观一致', module: 'compass' },
  { id: 'm6', title: '制定奥德赛计划', description: '设计三种人生版本', module: 'odyssey' },
  { id: 'm7', title: '识别重力问题', description: '区分问题和事实', module: 'prototype' },
  { id: 'm8', title: '完成第一次访谈', description: '进行人生设计访谈', module: 'prototype' },
  { id: 'm9', title: '尝试微体验', description: '低成本试错体验', module: 'prototype' },
  { id: 'm10', title: '30天练习完成', description: '完成设计思维30天挑战', module: 'design-thinking' },
];

const ANNUAL_REVIEW_TEMPLATE = {
  sections: [
    {
      id: 'highlights',
      title: '年度高光时刻',
      prompt: '今年让你最骄傲、最快乐的3-5个时刻是什么？',
      items: [],
    },
    {
      id: 'challenges',
      title: '年度挑战',
      prompt: '今年你面临的最大挑战是什么？你是如何应对的？',
      items: [],
    },
    {
      id: 'growth',
      title: '个人成长',
      prompt: '今年你学到了什么？哪些技能或认知有了提升？',
      items: [],
    },
    {
      id: 'gratitude',
      title: '感恩的人与事',
      prompt: '今年你最想感谢谁？什么事让你心怀感激？',
      items: [],
    },
    {
      id: 'dashboard',
      title: '仪表盘回顾',
      prompt: '对比年初和年末，你的健康/工作/娱乐/爱有什么变化？',
      items: [],
    },
    {
      id: 'next-year',
      title: '新一年的设计',
      prompt: '基于今年的经验，你明年想做哪些调整？',
      items: [],
    },
  ],
};

export const useJourney = () => {
  const [completedMilestones, setCompletedMilestones] = useLocalStorage('journey-milestones', []);
  const [annualReviews, setAnnualReviews] = useLocalStorage('journey-annual-reviews', []);
  const [stories, setStories] = useLocalStorage('journey-stories', []);
  const [activeTab, setActiveTab] = useLocalStorage('journey-active-tab', 'map');

  // 里程碑操作
  const toggleMilestone = useCallback((milestoneId) => {
    setCompletedMilestones(prev =>
      prev.includes(milestoneId)
        ? prev.filter(id => id !== milestoneId)
        : [...prev, milestoneId]
    );
  }, [setCompletedMilestones]);

  // 年度回顾
  const addAnnualReview = useCallback((year, sections) => {
    const entry = {
      id: generateId(),
      year,
      sections,
      timestamp: getTimestamp(),
    };
    setAnnualReviews(prev => [entry, ...prev]);
    return entry;
  }, [setAnnualReviews]);

  const updateAnnualReview = useCallback((id, updates) => {
    setAnnualReviews(prev =>
      prev.map(r => (r.id === id ? { ...r, ...updates } : r))
    );
  }, [setAnnualReviews]);

  // 故事库
  const addStory = useCallback((story) => {
    const entry = {
      id: generateId(),
      title: story.title || '',
      content: story.content || '',
      tags: story.tags || [],
      mood: story.mood || 'neutral',
      timestamp: getTimestamp(),
    };
    setStories(prev => [entry, ...prev]);
    return entry;
  }, [setStories]);

  const updateStory = useCallback((id, updates) => {
    setStories(prev =>
      prev.map(s => (s.id === id ? { ...s, ...updates } : s))
    );
  }, [setStories]);

  const removeStory = useCallback((id) => {
    setStories(prev => prev.filter(s => s.id !== id));
  }, [setStories]);

  // 计算进度
  const progress = {
    total: JOURNEY_MILESTONES.length,
    completed: completedMilestones.length,
    percentage: Math.round((completedMilestones.length / JOURNEY_MILESTONES.length) * 100),
  };

  return {
    // 状态
    milestones: JOURNEY_MILESTONES,
    completedMilestones,
    annualReviews,
    annualReviewTemplate: ANNUAL_REVIEW_TEMPLATE,
    stories,
    activeTab,
    progress,
    // 操作
    setActiveTab,
    toggleMilestone,
    addAnnualReview,
    updateAnnualReview,
    addStory,
    updateStory,
    removeStory,
  };
};

export default useJourney;
