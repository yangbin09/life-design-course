/**
 * 所有模块的初始数据
 */

// 仪表盘初始数据
export const initDashboardData = {
  health: 60,
  work: 60,
  play: 60,
  love: 60
};

// 奥德赛计划初始数据
export const initOdysseyPlans = [
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
    createdAt: new Date().toISOString()
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
    createdAt: new Date().toISOString()
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
    createdAt: new Date().toISOString()
  }
];

// 奥德赛评分初始数据
export const initOdysseyRatings = {
  'plan-1': { resources: 50, like: 50, confidence: 50, coherence: 50 },
  'plan-2': { resources: 50, like: 50, confidence: 50, coherence: 50 },
  'plan-3': { resources: 50, like: 50, confidence: 50, coherence: 50 }
};

// 好时光日志初始数据
export const initJournalList = [
  { name: '回复邮件', energy: 2, engagement: 3 },
  { name: '团队头脑风暴', energy: 8, engagement: 9 }
];

export const initJournalEntry = { name: '', energy: 5, engagement: 5 };

// 核心设计思维数据
export const mindsets = [
  {
    title: '好奇心',
    sub: 'Curiosity',
    desc: '像孩子一样探索，不预设答案。',
    action: '今天尝试走一条不同的路回家，或者和一个陌生人交谈。'
  },
  {
    title: '试错',
    sub: 'Bias to Action',
    desc: '先行动，再思考。通过尝试来验证。',
    action: '不要想那个计划了，今天就花15分钟做一个粗糙的版本。'
  },
  {
    title: '重构',
    sub: 'Reframe',
    desc: '卡住时，换个角度看问题。',
    action: "把'我必须'改成'我选择'，看看感觉有什么不同。"
  },
  {
    title: '觉察',
    sub: 'Awareness',
    desc: '意识到人生是过程，拥抱变化。',
    action: '接受今天发生的一件不顺心的事，告诉自己这也是过程的一部分。'
  },
  {
    title: '通力合作',
    sub: 'Collaboration',
    desc: '人生不是独角戏，寻求帮助。',
    action: '今天找一个人，请求他给你一个小小的建议或帮助。'
  }
];

// 奥德赛计划展示数据（含图标和颜色映射）
export const odysseyPlanDisplay = [
  {
    title: '人生一：当前道路',
    desc: '你目前正在做的事情的延续，按部就班的未来。',
    detail: '这是你现在的职业轨迹延伸。如果在接下来的5年里，你继续做现在做的事，你会变成什么样？',
    icon: 'Map',
    color: 'bg-blue-50 border-blue-200',
    accent: 'text-blue-600',
    barColor: 'bg-blue-500'
  },
  {
    title: '人生二：备选方案',
    desc: '如果人生一突然行不通了（例如行业消失），你会做什么？',
    detail: '这不是备胎，而是当第一条路完全堵死（比如AI取代了你的工作）时，你必须做的事情。',
    icon: 'RefreshCw',
    color: 'bg-purple-50 border-purple-200',
    accent: 'text-purple-600',
    barColor: 'bg-purple-500'
  },
  {
    title: '人生三：狂野梦想',
    desc: '如果钱和面子都不是问题，你会做什么？',
    detail: '在这个版本里，你已经财务自由，也没人会嘲笑你。你想去南极种菜？想去火星开酒吧？',
    icon: 'Lightbulb',
    color: 'bg-orange-50 border-orange-200',
    accent: 'text-orange-600',
    barColor: 'bg-orange-500'
  }
];

// 仪表盘维度配置
export const dashboardDimensions = [
  { key: 'health', label: '健康 (Health)', icon: 'Activity' },
  { key: 'work', label: '工作 (Work)', icon: 'Briefcase' },
  { key: 'play', label: '娱乐 (Play)', icon: 'Smile' },
  { key: 'love', label: '爱 (Love)', icon: 'Heart' }
];

// 导航锚点配置
export const navSections = [
  { id: 'mindset', label: '设计思维' },
  { id: 'dashboard', label: '人生仪表盘' },
  { id: 'compass', label: '寻路指南针' },
  { id: 'odyssey', label: '奥德赛计划' },
  { id: 'strategy', label: '解决问题' }
];

// 奥德赛评估指标配置
export const odysseyMetrics = [
  { id: 'resources', label: '我有资源吗?', sub: '(时间、金钱、人脉)' },
  { id: 'like', label: '我喜欢吗?', sub: '(无论成败都享受)' },
  { id: 'confidence', label: '我有信心吗?', sub: '(哪怕很难也能做到)' },
  { id: 'coherence', label: '符合一致性吗?', sub: '(这就是我吗)' }
];
