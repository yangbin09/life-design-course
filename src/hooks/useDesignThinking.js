import { useCallback } from 'react';
import useLocalStorage from './useLocalStorage';
import { generateId, getTimestamp } from '../utils/storage';

// 30天设计思维练习计划
const PRACTICE_PLAN = [
  { day: 1, title: '观察练习', description: '花10分钟观察一个公共场所，记录你注意到的5个细节', category: 'curiosity' },
  { day: 2, title: '同理心访谈', description: '和一个朋友聊30分钟，只问问题，不给建议', category: 'empathy' },
  { day: 3, title: '问题重构', description: '写下你当前最大的困扰，用5种不同的方式重新表述它', category: 'reframe' },
  { day: 4, title: '快速原型', description: '用纸笔画出你理想中一天的生活流程图', category: 'prototype' },
  { day: 5, title: '跨界学习', description: '学习一个你完全陌生的领域的基础知识（30分钟）', category: 'curiosity' },
  { day: 6, title: '失败日记', description: '记录3次失败经历，每次写下你从中学到了什么', category: 'awareness' },
  { day: 7, title: '能量审计', description: '回顾本周，标记出给你能量和消耗能量的活动', category: 'awareness' },
  { day: 8, title: '极端用户', description: '想象你的某个产品/服务的极端用户是谁，他们会怎么用', category: 'empathy' },
  { day: 9, title: '五分钟原型', description: '用5分钟画出解决一个生活小问题的方案草图', category: 'prototype' },
  { day: 10, title: '如果...会怎样', description: '对一个常规做法问5个"如果...会怎样"', category: 'reframe' },
  { day: 11, title: '故事收集', description: '收集3个陌生人的故事（可以是书、播客、或实际交谈）', category: 'empathy' },
  { day: 12, title: '约束创意', description: '给自己设定3个限制条件，在这些约束下想一个解决方案', category: 'reframe' },
  { day: 13, title: '身体风暴', description: '用身体动作来模拟你正在设计的体验', category: 'prototype' },
  { day: 14, title: '反思日', description: '回顾前两周的练习，写下3个最重要的发现', category: 'awareness' },
  { day: 15, title: '随机组合', description: '随机选择两个不相关的概念，找到它们之间的联系', category: 'curiosity' },
  { day: 16, title: '用户旅程图', description: '画出你日常通勤的用户旅程图，标注情绪变化', category: 'empathy' },
  { day: 17, title: '最差想法', description: '想出5个解决某个问题的最差方案，然后反转它们', category: 'reframe' },
  { day: 18, title: '纸板模型', description: '用纸板/纸张制作一个物理原型', category: 'prototype' },
  { day: 19, title: '旁观者', description: '像第一次见面一样观察一个你熟悉的地方', category: 'curiosity' },
  { day: 20, title: '情绪地图', description: '画出你过去一周的情绪起伏图', category: 'awareness' },
  { day: 21, title: '角色扮演', description: '假装你是另一个人来思考你面临的挑战', category: 'empathy' },
  { day: 22, title: '类比思维', description: '用另一个行业的做法来解决你当前的问题', category: 'reframe' },
  { day: 23, title: '服务蓝图', description: '为你提供给他人的某个服务画出服务蓝图', category: 'prototype' },
  { day: 24, title: '好奇心漫步', description: '不带目的地散步30分钟，跟随好奇心走', category: 'curiosity' },
  { day: 25, title: '感恩练习', description: '写下5件你感恩的事情和5个帮助过你的人', category: 'awareness' },
  { day: 26, title: '共创会', description: '邀请朋友一起头脑风暴一个有趣的问题', category: 'empathy' },
  { day: 27, title: '视角切换', description: '从5年后回看今天，写下你希望看到的变化', category: 'reframe' },
  { day: 28, title: '体验原型', description: '花1小时体验一种你想尝试的生活方式', category: 'prototype' },
  { day: 29, title: '模式识别', description: '回顾所有记录，寻找反复出现的主题或模式', category: 'awareness' },
  { day: 30, title: '设计宣言', description: '基于30天的练习，写下你的人生设计宣言', category: 'reframe' },
];

const CATEGORY_LABELS = {
  curiosity: { label: '好奇心', color: 'bg-yellow-100 text-yellow-800' },
  empathy: { label: '同理心', color: 'bg-pink-100 text-pink-800' },
  reframe: { label: '重构力', color: 'bg-purple-100 text-purple-800' },
  prototype: { label: '原型力', color: 'bg-blue-100 text-blue-800' },
  awareness: { label: '觉察力', color: 'bg-green-100 text-green-800' },
};

export const useDesignThinking = () => {
  const [checkedDays, setCheckedDays] = useLocalStorage('dt-checked-days', []);
  const [curiosities, setCuriosities] = useLocalStorage('dt-curiosities', []);
  const [reframes, setReframes] = useLocalStorage('dt-reframes', []);
  const [activeTab, setActiveTab] = useLocalStorage('dt-active-tab', 'calendar');

  // 打卡/取消打卡
  const toggleDay = useCallback((day) => {
    setCheckedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  }, [setCheckedDays]);

  // 添加好奇心记录
  const addCuriosity = useCallback((item) => {
    const entry = {
      id: generateId(),
      text: item.text,
      category: item.category || 'general',
      timestamp: getTimestamp(),
    };
    setCuriosities(prev => [entry, ...prev]);
    return entry;
  }, [setCuriosities]);

  // 删除好奇心记录
  const removeCuriosity = useCallback((id) => {
    setCuriosities(prev => prev.filter(c => c.id !== id));
  }, [setCuriosities]);

  // 随机抽取一个好奇心
  const drawRandomCuriosity = useCallback(() => {
    if (curiosities.length === 0) return null;
    return curiosities[Math.floor(Math.random() * curiosities.length)];
  }, [curiosities]);

  // 添加重构练习
  const addReframe = useCallback((original, reframed) => {
    const entry = {
      id: generateId(),
      original,
      reframed,
      timestamp: getTimestamp(),
    };
    setReframes(prev => [entry, ...prev]);
    return entry;
  }, [setReframes]);

  // 删除重构练习
  const removeReframe = useCallback((id) => {
    setReframes(prev => prev.filter(r => r.id !== id));
  }, [setReframes]);

  // 获取完成进度
  const progress = {
    total: 30,
    completed: checkedDays.length,
    percentage: Math.round((checkedDays.length / 30) * 100),
  };

  // 获取各分类完成情况
  const categoryProgress = Object.keys(CATEGORY_LABELS).map(cat => {
    const total = PRACTICE_PLAN.filter(p => p.category === cat).length;
    const completed = PRACTICE_PLAN.filter(p => p.category === cat && checkedDays.includes(p.day)).length;
    return { ...CATEGORY_LABELS[cat], key: cat, total, completed };
  });

  return {
    // 状态
    practicePlan: PRACTICE_PLAN,
    categoryLabels: CATEGORY_LABELS,
    checkedDays,
    curiosities,
    reframes,
    activeTab,
    progress,
    categoryProgress,
    // 操作
    setActiveTab,
    toggleDay,
    addCuriosity,
    removeCuriosity,
    drawRandomCuriosity,
    addReframe,
    removeReframe,
  };
};

export default useDesignThinking;
