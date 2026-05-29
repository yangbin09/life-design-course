import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { getTimestamp, generateId } from '../utils/storage';

/**
 * 仪表盘对比功能 Hook
 * 支持自评和他评两种模式，对比认知差异
 */
export const useDashboardCompare = () => {
  // 当前对比模式：'self' | 'other'
  const [compareMode, setCompareMode] = useState('self');

  // 他评数据
  const [otherData, setOtherData] = useLocalStorage('dashboard-other-eval', {
    health: 50,
    work: 50,
    play: 50,
    love: 50
  });

  // 他评者名称
  const [evaluatorName, setEvaluatorName] = useLocalStorage('dashboard-evaluator-name', '');

  // 历史对比记录
  const [compareHistory, setCompareHistory] = useLocalStorage('dashboard-compare-history', []);

  // 更新他评维度
  const updateOtherDimension = useCallback((key, value) => {
    setOtherData(prev => ({ ...prev, [key]: value }));
  }, [setOtherData]);

  // 计算两个数据集之间的差异
  const getDifferences = useCallback((selfData) => {
    const dimensions = ['health', 'work', 'play', 'love'];
    const dimensionNames = {
      health: '健康',
      work: '工作',
      play: '娱乐',
      love: '爱'
    };

    return dimensions.map(dim => {
      const selfVal = selfData[dim] || 0;
      const otherVal = otherData[dim] || 0;
      const diff = otherVal - selfVal;

      let status = 'match';
      if (diff > 10) status = 'higher';
      else if (diff < -10) status = 'lower';

      return {
        key: dim,
        name: dimensionNames[dim],
        selfValue: selfVal,
        otherValue: otherVal,
        diff,
        status,
        absDiff: Math.abs(diff)
      };
    });
  }, [otherData]);

  // 获取最大差异维度
  const getMaxDifference = useCallback((selfData) => {
    const diffs = getDifferences(selfData);
    return diffs.reduce((max, item) =>
      item.absDiff > max.absDiff ? item : max
    , { absDiff: 0 });
  }, [getDifferences]);

  // 获取对比分析文本
  const getCompareAnalysis = useCallback((selfData) => {
    const diffs = getDifferences(selfData);
    const avgDiff = diffs.reduce((sum, d) => sum + d.absDiff, 0) / diffs.length;
    const maxDiff = getMaxDifference(selfData);

    let summary = '';
    let insights = [];

    if (avgDiff < 5) {
      summary = '你和他人的认知高度一致，说明你的自我认知非常准确。';
    } else if (avgDiff < 15) {
      summary = '存在一些认知差异，这很正常。差异往往揭示了盲点。';
    } else {
      summary = '认知差异较大，建议深入交流，了解对方的观察角度。';
    }

    // 找出对方评价更高的维度
    const higherDims = diffs.filter(d => d.status === 'higher').map(d => d.name);
    const lowerDims = diffs.filter(d => d.status === 'lower').map(d => d.name);

    if (higherDims.length > 0) {
      insights.push(`对方认为你在 ${higherDims.join('、')} 方面比你自评更好，也许你低估了自己。`);
    }
    if (lowerDims.length > 0) {
      insights.push(`对方认为你在 ${lowerDims.join('、')} 方面还有提升空间，值得反思。`);
    }
    if (maxDiff.absDiff > 20) {
      insights.push(`最大差异出现在"${maxDiff.name}"维度（差距 ${maxDiff.absDiff} 分），建议重点关注讨论。`);
    }

    return { summary, insights, avgDiff: Math.round(avgDiff) };
  }, [getDifferences, getMaxDifference]);

  // 保存对比记录
  const saveCompareRecord = useCallback((selfData) => {
    const record = {
      id: generateId(),
      timestamp: getTimestamp(),
      evaluatorName: evaluatorName || '匿名',
      selfData: { ...selfData },
      otherData: { ...otherData },
      differences: getDifferences(selfData),
      analysis: getCompareAnalysis(selfData)
    };
    setCompareHistory(prev => [...prev, record]);
    return record;
  }, [evaluatorName, otherData, getDifferences, getCompareAnalysis, setCompareHistory]);

  // 重置他评数据
  const resetOtherData = useCallback(() => {
    setOtherData({ health: 50, work: 50, play: 50, love: 50 });
    setEvaluatorName('');
  }, [setOtherData, setEvaluatorName]);

  // 清空对比历史
  const clearCompareHistory = useCallback(() => {
    setCompareHistory([]);
  }, [setCompareHistory]);

  return {
    compareMode,
    setCompareMode,
    otherData,
    updateOtherDimension,
    evaluatorName,
    setEvaluatorName,
    compareHistory,
    getDifferences,
    getMaxDifference,
    getCompareAnalysis,
    saveCompareRecord,
    resetOtherData,
    clearCompareHistory
  };
};

export default useDashboardCompare;
