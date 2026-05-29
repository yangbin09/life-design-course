import { useLocalStorage } from './useLocalStorage';
import { generateId, getTimestamp } from '../utils/storage';

/**
 * 奥德赛计划时间线管理 Hook
 * 管理5年时间线数据、添加/删除节点、生成默认时间线
 */
export const useOdysseyTimeline = () => {
  const [timelineData, setTimelineData] = useLocalStorage('odyssey-timeline', {
    'plan-1': generateDefaultTimeline('plan-1'),
    'plan-2': generateDefaultTimeline('plan-2'),
    'plan-3': generateDefaultTimeline('plan-3')
  });

  // 生成默认的5年时间线节点
  function generateDefaultTimeline(planId) {
    const yearLabels = {
      'plan-1': [
        { year: 1, label: '深耕现有领域', description: '在当前岗位上精进核心技能，争取晋升机会' },
        { year: 2, label: '建立行业影响力', description: '通过分享和输出建立个人品牌' },
        { year: 3, label: '拓展管理能力', description: '承担更多管理职责，带领小团队' },
        { year: 4, label: '成为领域专家', description: '在行业内有一定知名度和话语权' },
        { year: 5, label: '实现职业目标', description: '达到预定的职业高度，开始思考下一步' }
      ],
      'plan-2': [
        { year: 1, label: '学习新领域基础', description: '投入时间学习新行业的核心知识' },
        { year: 2, label: '建立新技能栈', description: '通过项目实践积累新领域经验' },
        { year: 3, label: '完成转型过渡', description: '正式进入新领域，建立新的职业身份' },
        { year: 4, label: '站稳脚跟', description: '在新领域获得认可和稳定发展' },
        { year: 5, label: '新领域深耕', description: '在新领域建立自己的核心竞争力' }
      ],
      'plan-3': [
        { year: 1, label: '探索与实验', description: '大胆尝试各种可能性，找到真正热爱' },
        { year: 2, label: '确定方向', description: '从众多尝试中找到最想走的路' },
        { year: 3, label: '全力投入', description: '将全部精力投入到热爱的事业中' },
        { year: 4, label: '突破瓶颈', description: '克服关键困难，实现质的飞跃' },
        { year: 5, label: '梦想成真', description: '活出理想中的人生版本' }
      ]
    };

    return (yearLabels[planId] || []).map(node => ({
      id: generateId(),
      year: node.year,
      label: node.label,
      description: node.description,
      isDefault: true,
      createdAt: getTimestamp()
    }));
  }

  // 添加时间线节点
  const addNode = (planId, node) => {
    const newNode = {
      id: generateId(),
      ...node,
      isDefault: false,
      createdAt: getTimestamp()
    };
    setTimelineData(prev => ({
      ...prev,
      [planId]: [...(prev[planId] || []), newNode].sort((a, b) => a.year - b.year)
    }));
    return newNode;
  };

  // 更新时间线节点
  const updateNode = (planId, nodeId, updates) => {
    setTimelineData(prev => ({
      ...prev,
      [planId]: (prev[planId] || []).map(node =>
        node.id === nodeId ? { ...node, ...updates } : node
      ).sort((a, b) => a.year - b.year)
    }));
  };

  // 删除时间线节点
  const removeNode = (planId, nodeId) => {
    setTimelineData(prev => ({
      ...prev,
      [planId]: (prev[planId] || []).filter(node => node.id !== nodeId)
    }));
  };

  // 获取某个计划的时间线
  const getTimeline = (planId) => {
    return timelineData[planId] || [];
  };

  // 获取所有计划的时间线（用于对比视图）
  const getAllTimelines = () => {
    return timelineData;
  };

  // 重置某个计划的时间线为默认值
  const resetTimeline = (planId) => {
    setTimelineData(prev => ({
      ...prev,
      [planId]: generateDefaultTimeline(planId)
    }));
  };

  // 获取时间线统计
  const getTimelineStats = (planId) => {
    const timeline = timelineData[planId] || [];
    return {
      totalNodes: timeline.length,
      customNodes: timeline.filter(n => !n.isDefault).length,
      yearSpan: timeline.length > 0
        ? Math.max(...timeline.map(n => n.year)) - Math.min(...timeline.map(n => n.year))
        : 0
    };
  };

  return {
    timelineData,
    addNode,
    updateNode,
    removeNode,
    getTimeline,
    getAllTimelines,
    resetTimeline,
    getTimelineStats
  };
};

export default useOdysseyTimeline;
