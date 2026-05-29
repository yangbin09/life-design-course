import { useLocalStorage } from './useLocalStorage';
import { getTimestamp, generateId } from '../utils/storage';

/**
 * 仪表盘数据管理 Hook
 */
export const useDashboard = () => {
  const [currentData, setCurrentData] = useLocalStorage('dashboard-current', {
    health: 60,
    work: 60,
    play: 60,
    love: 60
  });

  const [history, setHistory] = useLocalStorage('dashboard-history', []);

  // 更新单个维度
  const updateDimension = (key, value) => {
    setCurrentData(prev => ({ ...prev, [key]: value }));
  };

  // 保存当前评估到历史记录
  const saveToHistory = () => {
    const entry = {
      id: generateId(),
      timestamp: getTimestamp(),
      data: { ...currentData }
    };
    setHistory(prev => [...prev, entry]);
    return entry;
  };

  // 获取历史趋势数据
  const getTrendData = (dimension, timeRange = 'month') => {
    const now = new Date();
    let filtered = history;

    if (timeRange === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = history.filter(h => new Date(h.timestamp) >= weekAgo);
    } else if (timeRange === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = history.filter(h => new Date(h.timestamp) >= monthAgo);
    } else if (timeRange === 'year') {
      const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      filtered = history.filter(h => new Date(h.timestamp) >= yearAgo);
    }

    return filtered.map(h => ({
      timestamp: h.timestamp,
      value: h.data[dimension]
    }));
  };

  // 生成诊断报告
  const generateDiagnosis = () => {
    const lowItems = Object.entries(currentData).filter(([_, val]) => val < 40);
    const highItems = Object.entries(currentData).filter(([_, val]) => val > 80);

    const dimensionNames = {
      health: '健康',
      work: '工作',
      play: '娱乐',
      love: '爱'
    };

    let diagnosis = {
      balance: lowItems.length === 0 ? 'balanced' : 'imbalanced',
      lowDimensions: lowItems.map(([k]) => dimensionNames[k]),
      highDimensions: highItems.map(([k]) => dimensionNames[k]),
      suggestions: []
    };

    if (lowItems.length > 0) {
      diagnosis.suggestions.push(`重点关注${diagnosis.lowDimensions.join('和')}维度`);
    }

    if (currentData.work > 80 && currentData.play < 40) {
      diagnosis.suggestions.push('工作压力较大，建议增加娱乐放松时间');
    }

    if (currentData.health < 40) {
      diagnosis.suggestions.push('健康维度较低，建议关注作息和运动');
    }

    return diagnosis;
  };

  // 清空历史记录
  const clearHistory = () => {
    setHistory([]);
  };

  return {
    currentData,
    history,
    updateDimension,
    saveToHistory,
    getTrendData,
    generateDiagnosis,
    clearHistory
  };
};

export default useDashboard;
