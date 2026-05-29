import { useState, useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { generateId, getTimestamp } from '../utils/storage';

/**
 * 活动分类常量
 */
export const CATEGORIES = {
  WORK: 'work',
  STUDY: 'study',
  EXERCISE: 'exercise',
  SOCIAL: 'social',
  CREATIVE: 'creative',
  REST: 'rest',
  HOBBY: 'hobby',
  OTHER: 'other'
};

export const CATEGORY_LABELS = {
  [CATEGORIES.WORK]: '工作',
  [CATEGORIES.STUDY]: '学习',
  [CATEGORIES.EXERCISE]: '运动',
  [CATEGORIES.SOCIAL]: '社交',
  [CATEGORIES.CREATIVE]: '创作',
  [CATEGORIES.REST]: '休息',
  [CATEGORIES.HOBBY]: '爱好',
  [CATEGORIES.OTHER]: '其他'
};

export const CATEGORY_COLORS = {
  [CATEGORIES.WORK]: 'bg-blue-100 text-blue-800',
  [CATEGORIES.STUDY]: 'bg-purple-100 text-purple-800',
  [CATEGORIES.EXERCISE]: 'bg-orange-100 text-orange-800',
  [CATEGORIES.SOCIAL]: 'bg-pink-100 text-pink-800',
  [CATEGORIES.CREATIVE]: 'bg-yellow-100 text-yellow-800',
  [CATEGORIES.REST]: 'bg-teal-100 text-teal-800',
  [CATEGORIES.HOBBY]: 'bg-indigo-100 text-indigo-800',
  [CATEGORIES.OTHER]: 'bg-gray-100 text-gray-800'
};

/**
 * 好时光日志数据管理 Hook
 * 基于《斯坦福人生设计课》的好时光日志理念：
 * - 记录能量(Energy)和专注度(Engagement)
 * - 识别心流活动
 * - 分析工作中的能量来源
 */
export const useJournal = () => {
  const [entries, setEntries] = useLocalStorage('journal-entries', []);

  // 添加日志条目
  const addEntry = useCallback((entry) => {
    const newEntry = {
      id: generateId(),
      name: entry.name || '',
      energy: entry.energy ?? 5,
      engagement: entry.engagement ?? 5,
      category: entry.category || CATEGORIES.OTHER,
      note: entry.note || '',
      timestamp: getTimestamp()
    };
    setEntries(prev => [...prev, newEntry]);
    return newEntry;
  }, [setEntries]);

  // 更新日志条目
  const updateEntry = useCallback((id, updates) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  }, [setEntries]);

  // 删除日志条目
  const deleteEntry = useCallback((id) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  }, [setEntries]);

  // 清空所有日志
  const clearEntries = useCallback(() => {
    setEntries([]);
  }, [setEntries]);

  /**
   * 获取能量地图数据
   * 返回格式化的散点图数据，按心流区域分组
   */
  const getEnergyMapData = useMemo(() => {
    return entries.map(entry => ({
      id: entry.id,
      name: entry.name,
      x: entry.engagement,  // 专注度 -> X轴
      y: entry.energy,      // 能量   -> Y轴
      category: entry.category,
      // 心流区域：高专注度 + 高能量
      isFlow: entry.engagement >= 7 && entry.energy >= 7,
      // 象限判断
      quadrant: entry.engagement >= 5
        ? (entry.energy >= 5 ? 'highBoth' : 'highEngagement')
        : (entry.energy >= 5 ? 'highEnergy' : 'lowBoth')
    }));
  }, [entries]);

  /**
   * 聚类分析：自动识别心流活动
   * 心流 = 高专注度 + 高能量
   */
  const getFlowActivities = useMemo(() => {
    return entries
      .filter(e => e.engagement >= 7 && e.energy >= 7)
      .sort((a, b) => (b.engagement + b.energy) - (a.engagement + a.energy));
  }, [entries]);

  /**
   * 获取耗能活动
   * 耗能 = 高专注度 + 低能量
   */
  const getDrainActivities = useMemo(() => {
    return entries
      .filter(e => e.engagement >= 7 && e.energy <= 4)
      .sort((a, b) => a.energy - b.energy);
  }, [entries]);

  /**
   * 生成报告
   * @param {'week'|'month'} period - 报告周期
   */
  const generateReport = useCallback((period = 'week') => {
    const now = new Date();
    let filtered = entries;

    if (period === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = entries.filter(e => new Date(e.timestamp) >= weekAgo);
    } else if (period === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = entries.filter(e => new Date(e.timestamp) >= monthAgo);
    }

    if (filtered.length === 0) {
      return {
        period,
        totalEntries: 0,
        avgEnergy: 0,
        avgEngagement: 0,
        flowTimeRatio: 0,
        flowActivities: [],
        topCategories: [],
        suggestions: ['还没有记录，快来记录你的第一项活动吧！']
      };
    }

    const avgEnergy = filtered.reduce((sum, e) => sum + e.energy, 0) / filtered.length;
    const avgEngagement = filtered.reduce((sum, e) => sum + e.engagement, 0) / filtered.length;

    // 心流时间占比
    const flowEntries = filtered.filter(e => e.engagement >= 7 && e.energy >= 7);
    const flowTimeRatio = Math.round((flowEntries.length / filtered.length) * 100);

    // 按分类统计
    const categoryCount = {};
    const categoryEnergy = {};
    filtered.forEach(e => {
      categoryCount[e.category] = (categoryCount[e.category] || 0) + 1;
      if (!categoryEnergy[e.category]) categoryEnergy[e.category] = [];
      categoryEnergy[e.category].push(e.energy);
    });

    const topCategories = Object.entries(categoryCount)
      .map(([cat, count]) => ({
        category: cat,
        label: CATEGORY_LABELS[cat] || cat,
        count,
        avgEnergy: Math.round(categoryEnergy[cat].reduce((a, b) => a + b, 0) / categoryEnergy[cat].length * 10) / 10,
        percentage: Math.round((count / filtered.length) * 100)
      }))
      .sort((a, b) => b.count - a.count);

    // 生成建议
    const suggestions = [];
    if (flowTimeRatio < 30) {
      suggestions.push('心流时间不足，建议增加让你全情投入且充满能量的活动。');
    }
    if (avgEnergy < 5) {
      suggestions.push('整体能量偏低，注意休息和调整节奏。');
    }
    if (avgEngagement < 5) {
      suggestions.push('专注度不够，试试排除干扰源，专注于一件重要的事。');
    }
    if (flowTimeRatio >= 50) {
      suggestions.push('心流时间很棒！继续保持这种状态。');
    }
    if (topCategories.length > 0 && topCategories[0].avgEnergy >= 7) {
      suggestions.push(`${topCategories[0].label}是你最大的能量来源，可以多安排这类活动。`);
    }

    return {
      period,
      totalEntries: filtered.length,
      avgEnergy: Math.round(avgEnergy * 10) / 10,
      avgEngagement: Math.round(avgEngagement * 10) / 10,
      flowTimeRatio,
      flowActivities: flowEntries.map(e => e.name),
      topCategories,
      suggestions,
      // 每日分布数据
      dailyData: getDailyDistribution(filtered)
    };
  }, [entries]);

  /**
   * 获取工作关联分析
   * 分析工作类活动的能量和专注度模式
   */
  const getWorkAnalysis = useMemo(() => {
    const workEntries = entries.filter(e => e.category === CATEGORIES.WORK);
    const nonWorkEntries = entries.filter(e => e.category !== CATEGORIES.WORK);

    if (workEntries.length === 0) {
      return {
        hasData: false,
        totalWork: 0,
        workFlowCount: 0,
        workFlowRatio: 0,
        avgWorkEnergy: 0,
        avgWorkEngagement: 0,
        workVsNonWork: null,
        energySources: [],
        suggestions: ['还没有工作活动记录，标记一些工作相关活动来分析你的工作能量来源。']
      };
    }

    const avgWorkEnergy = workEntries.reduce((sum, e) => sum + e.energy, 0) / workEntries.length;
    const avgWorkEngagement = workEntries.reduce((sum, e) => sum + e.engagement, 0) / workEntries.length;

    const workFlowEntries = workEntries.filter(e => e.engagement >= 7 && e.energy >= 7);
    const workFlowRatio = Math.round((workFlowEntries.length / workEntries.length) * 100);

    // 工作 vs 非工作对比
    let workVsNonWork = null;
    if (nonWorkEntries.length > 0) {
      const avgNonWorkEnergy = nonWorkEntries.reduce((sum, e) => sum + e.energy, 0) / nonWorkEntries.length;
      const avgNonWorkEngagement = nonWorkEntries.reduce((sum, e) => sum + e.engagement, 0) / nonWorkEntries.length;
      workVsNonWork = {
        workEnergy: Math.round(avgWorkEnergy * 10) / 10,
        nonWorkEnergy: Math.round(avgNonWorkEnergy * 10) / 10,
        workEngagement: Math.round(avgWorkEngagement * 10) / 10,
        nonWorkEngagement: Math.round(avgNonWorkEngagement * 10) / 10
      };
    }

    // 能量来源排名：工作中心流活动
    const energySources = workEntries
      .sort((a, b) => (b.energy + b.engagement) - (a.energy + a.engagement))
      .slice(0, 5)
      .map(e => ({
        name: e.name,
        energy: e.energy,
        engagement: e.engagement,
        isFlow: e.engagement >= 7 && e.energy >= 7
      }));

    // 生成建议
    const suggestions = [];
    if (workFlowRatio >= 50) {
      suggestions.push('工作中的心流比例很高，说明你正在做适合自己的工作！');
    } else if (workFlowRatio < 20) {
      suggestions.push('工作中心流比例偏低，思考哪些工作内容让你最投入，尝试增加这些活动。');
    }
    if (avgWorkEnergy < 5) {
      suggestions.push('工作整体消耗能量，注意穿插休息和充电活动。');
    }
    if (energySources.length > 0 && energySources[0].isFlow) {
      suggestions.push(`"${energySources[0].name}"是你工作中最大的能量来源。`);
    }

    return {
      hasData: true,
      totalWork: workEntries.length,
      workFlowCount: workFlowEntries.length,
      workFlowRatio,
      avgWorkEnergy: Math.round(avgWorkEnergy * 10) / 10,
      avgWorkEngagement: Math.round(avgWorkEngagement * 10) / 10,
      workVsNonWork,
      energySources,
      suggestions
    };
  }, [entries]);

  return {
    entries,
    addEntry,
    updateEntry,
    deleteEntry,
    clearEntries,
    getEnergyMapData,
    getFlowActivities,
    getDrainActivities,
    generateReport,
    getWorkAnalysis
  };
};

/**
 * 获取每日分布数据（辅助函数）
 */
function getDailyDistribution(entries) {
  const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const dailyMap = {};

  entries.forEach(e => {
    const day = new Date(e.timestamp).getDay();
    if (!dailyMap[day]) dailyMap[day] = { count: 0, totalEnergy: 0, totalEngagement: 0 };
    dailyMap[day].count++;
    dailyMap[day].totalEnergy += e.energy;
    dailyMap[day].totalEngagement += e.engagement;
  });

  return dayNames.map((name, idx) => ({
    day: name,
    count: dailyMap[idx]?.count || 0,
    avgEnergy: dailyMap[idx] ? Math.round(dailyMap[idx].totalEnergy / dailyMap[idx].count * 10) / 10 : 0,
    avgEngagement: dailyMap[idx] ? Math.round(dailyMap[idx].totalEngagement / dailyMap[idx].count * 10) / 10 : 0
  }));
}

export default useJournal;
