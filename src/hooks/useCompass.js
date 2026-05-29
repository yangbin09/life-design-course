import { useCallback } from 'react';
import useLocalStorage from './useLocalStorage';
import { generateId, getTimestamp } from '../utils/storage';

const ALIGNMENT_QUESTIONS = [
  { id: 'q1', text: '我的工作让我感到有意义', dimension: 'meaning' },
  { id: 'q2', text: '我的日常工作与我的核心价值观一致', dimension: 'values' },
  { id: 'q3', text: '我清楚自己为什么做现在的工作', dimension: 'purpose' },
  { id: 'q4', text: '我在工作中有机会发挥自己的优势', dimension: 'strengths' },
  { id: 'q5', text: '我的工作对他人有积极影响', dimension: 'impact' },
  { id: 'q6', text: '我的生活方式让我感到充实', dimension: 'life' },
  { id: 'q7', text: '我花时间在真正重要的事情上', dimension: 'priorities' },
  { id: 'q8', text: '我对未来有清晰的方向感', dimension: 'direction' },
  { id: 'q9', text: '我的工作和生活相互促进而非冲突', dimension: 'balance' },
  { id: 'q10', text: '我能坦然面对自己的选择', dimension: 'acceptance' },
];

const DEFAULT_WORK_VIEW = {
  title: '我的工作观',
  content: '',
  questions: [
    '我认为工作的意义是什么？',
    '工作对我来说意味着什么？',
    '好工作的标准是什么？',
    '工作与金钱、成长、贡献之间的关系是什么？',
    '工作在整个人生中应该扮演什么角色？',
  ],
};

const DEFAULT_LIFE_VIEW = {
  title: '我的人生观',
  content: '',
  questions: [
    '我认为人生的意义是什么？',
    '什么对我来说是最重要的？',
    '我信仰什么？我的核心价值观是什么？',
    '我如何定义好的人生？',
    '我与他人、与世界的关系是什么？',
  ],
};

export const useCompass = () => {
  const [workView, setWorkView] = useLocalStorage('compass-work-view', DEFAULT_WORK_VIEW);
  const [lifeView, setLifeView] = useLocalStorage('compass-life-view', DEFAULT_LIFE_VIEW);
  const [history, setHistory] = useLocalStorage('compass-history', []);
  const [alignmentScores, setAlignmentScores] = useLocalStorage('compass-alignment', null);
  const [activeTab, setActiveTab] = useLocalStorage('compass-active-tab', 'writing');

  // 保存书写版本
  const saveVersion = useCallback((type) => {
    const current = type === 'work' ? workView : lifeView;
    const entry = {
      id: generateId(),
      type,
      content: current.content,
      timestamp: getTimestamp(),
    };
    if (current.content.trim()) {
      setHistory(prev => [entry, ...prev]);
    }
  }, [workView, lifeView, setHistory]);

  // 更新工作观
  const updateWorkView = useCallback((updates) => {
    setWorkView(prev => ({ ...prev, ...updates }));
  }, [setWorkView]);

  // 更新人生观
  const updateLifeView = useCallback((updates) => {
    setLifeView(prev => ({ ...prev, ...updates }));
  }, [setLifeView]);

  // 计算一致性检测结果
  const calculateAlignment = useCallback((answers) => {
    const dimensions = {};
    answers.forEach(({ dimension, score }) => {
      if (!dimensions[dimension]) dimensions[dimension] = [];
      dimensions[dimension].push(score);
    });

    const radarData = Object.entries(dimensions).map(([dim, scores]) => ({
      dimension: dim,
      score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    }));

    const totalScore = Math.round(
      radarData.reduce((sum, d) => sum + d.score, 0) / radarData.length
    );

    const result = {
      id: generateId(),
      totalScore,
      radarData,
      answers,
      timestamp: getTimestamp(),
      feedback: getAlignmentFeedback(totalScore),
    };

    setAlignmentScores(result);
    return result;
  }, [setAlignmentScores]);

  // 获取一致性反馈
  const getAlignmentFeedback = (score) => {
    if (score >= 80) return { level: 'excellent', text: '你的工作观与人生观高度一致！继续保持这种清晰的方向感。', color: 'text-green-600' };
    if (score >= 60) return { level: 'good', text: '整体还不错，但某些方面可以进一步对齐。关注那些分数较低的维度。', color: 'text-blue-600' };
    if (score >= 40) return { level: 'moderate', text: '存在一定偏差。建议重新审视你的工作观和人生观，找出不一致的根源。', color: 'text-yellow-600' };
    return { level: 'low', text: '你当前的生活方向与内心价值观存在较大差距。这正是需要重新设计的信号。', color: 'text-red-600' };
  };

  // 清空所有数据
  const resetCompass = useCallback(() => {
    setWorkView(DEFAULT_WORK_VIEW);
    setLifeView(DEFAULT_LIFE_VIEW);
    setHistory([]);
    setAlignmentScores(null);
  }, [setWorkView, setLifeView, setHistory, setAlignmentScores]);

  return {
    // 状态
    workView,
    lifeView,
    history,
    alignmentScores,
    activeTab,
    alignmentQuestions: ALIGNMENT_QUESTIONS,
    // 操作
    setActiveTab,
    updateWorkView,
    updateLifeView,
    saveVersion,
    calculateAlignment,
    resetCompass,
  };
};

export default useCompass;
