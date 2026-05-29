import { useLocalStorage } from './useLocalStorage';
import { generateId, getTimestamp } from '../utils/storage';

/**
 * 奥德赛计划数据管理 Hook
 */
export const useOdyssey = () => {
  const [plans, setPlans] = useLocalStorage('odyssey-plans', [
    {
      id: 'plan-1',
      title: '人生一：当前道路',
      desc: '你目前正在做的事情的延续，按部就班的未来。',
      detail: '这是你现在的职业轨迹延伸。如果在接下来的5年里，你继续做现在做的事，你会变成什么样？',
      color: 'blue',
      resources: { time: 50, money: 50, connections: 50, skills: 50 },
      timeline: [],
      milestones: [],
      obstacles: [],
      createdAt: getTimestamp()
    },
    {
      id: 'plan-2',
      title: '人生二：备选方案',
      desc: '如果人生一突然行不通了（例如行业消失），你会做什么？',
      detail: '这不是备胎，而是当第一条路完全堵死（比如AI取代了你的工作）时，你必须做的事情。',
      color: 'purple',
      resources: { time: 50, money: 50, connections: 50, skills: 50 },
      timeline: [],
      milestones: [],
      obstacles: [],
      createdAt: getTimestamp()
    },
    {
      id: 'plan-3',
      title: '人生三：狂野梦想',
      desc: '如果钱和面子都不是问题，你会做什么？',
      detail: '在这个版本里，你已经财务自由，也没人会嘲笑你。你想去南极种菜？想去火星开酒吧？',
      color: 'orange',
      resources: { time: 50, money: 50, connections: 50, skills: 50 },
      timeline: [],
      milestones: [],
      obstacles: [],
      createdAt: getTimestamp()
    }
  ]);

  const [ratings, setRatings] = useLocalStorage('odyssey-ratings', {
    'plan-1': { resources: 50, like: 50, confidence: 50, coherence: 50 },
    'plan-2': { resources: 50, like: 50, confidence: 50, coherence: 50 },
    'plan-3': { resources: 50, like: 50, confidence: 50, coherence: 50 }
  });

  // 更新计划描述
  const updatePlan = (planId, updates) => {
    setPlans(prev => prev.map(p => p.id === planId ? { ...p, ...updates } : p));
  };

  // 更新评分
  const updateRating = (planId, metric, value) => {
    setRatings(prev => ({
      ...prev,
      [planId]: { ...prev[planId], [metric]: value }
    }));
  };

  // 更新资源清单
  const updateResources = (planId, resourceType, value) => {
    setPlans(prev => prev.map(p => {
      if (p.id === planId) {
        return {
          ...p,
          resources: { ...p.resources, [resourceType]: value }
        };
      }
      return p;
    }));
  };

  // 添加时间线节点
  const addTimelineNode = (planId, node) => {
    const newNode = {
      id: generateId(),
      ...node,
      createdAt: getTimestamp()
    };
    setPlans(prev => prev.map(p => {
      if (p.id === planId) {
        return {
          ...p,
          timeline: [...p.timeline, newNode].sort((a, b) => a.year - b.year)
        };
      }
      return p;
    }));
  };

  // 添加里程碑
  const addMilestone = (planId, milestone) => {
    const newMilestone = {
      id: generateId(),
      ...milestone,
      createdAt: getTimestamp()
    };
    setPlans(prev => prev.map(p => {
      if (p.id === planId) {
        return { ...p, milestones: [...p.milestones, newMilestone] };
      }
      return p;
    }));
  };

  // 添加障碍
  const addObstacle = (planId, obstacle) => {
    const newObstacle = {
      id: generateId(),
      ...obstacle,
      createdAt: getTimestamp()
    };
    setPlans(prev => prev.map(p => {
      if (p.id === planId) {
        return { ...p, obstacles: [...p.obstacles, newObstacle] };
      }
      return p;
    }));
  };

  // 获取计划对比数据
  const getComparisonData = () => {
    return plans.map(plan => ({
      id: plan.id,
      title: plan.title,
      rating: ratings[plan.id],
      resourceScore: Object.values(plan.resources).reduce((a, b) => a + b, 0) / 4
    }));
  };

  // 生成资源缺口报告
  const getResourceGapReport = (planId) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return null;

    const gaps = Object.entries(plan.resources)
      .filter(([_, val]) => val < 40)
      .map(([key, val]) => ({ resource: key, current: val, needed: 60 }));

    return {
      planId,
      planTitle: plan.title,
      gaps,
      overallScore: Object.values(plan.resources).reduce((a, b) => a + b, 0) / 4
    };
  };

  return {
    plans,
    ratings,
    updatePlan,
    updateRating,
    updateResources,
    addTimelineNode,
    addMilestone,
    addObstacle,
    getComparisonData,
    getResourceGapReport
  };
};

export default useOdyssey;
