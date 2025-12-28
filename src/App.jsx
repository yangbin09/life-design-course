import React, { useState } from 'react';
import { 
  Compass, 
  Battery, 
  Zap, 
  Heart, 
  Briefcase, 
  Smile, 
  Activity, 
  Map, 
  Anchor, 
  Search, 
  RefreshCw, 
  Users, 
  Lightbulb, 
  ArrowRight,
  CheckCircle,
  BarChart2,
  Plus
} from 'lucide-react';

const DYLPage = () => {
  // 1. 仪表盘状态
  const [dashboardData, setDashboardData] = useState({
    health: 60,
    work: 60,
    play: 60,
    love: 60
  });

  // 2. 奥德赛计划状态 & 评分状态
  const [activeOdyssey, setActiveOdyssey] = useState(0);
  const [odysseyRatings, setOdysseyRatings] = useState({
    0: { resources: 50, like: 50, confidence: 50, coherence: 50 },
    1: { resources: 50, like: 50, confidence: 50, coherence: 50 },
    2: { resources: 50, like: 50, confidence: 50, coherence: 50 },
  });

  // 3. 思维模式交互状态
  const [activeMindset, setActiveMindset] = useState(null);

  // 4. 好时光日志演示状态
  const [journalEntry, setJournalEntry] = useState({ name: '', energy: 5, engagement: 5 });
  const [journalList, setJournalList] = useState([
    { name: '回复邮件', energy: 2, engagement: 3 },
    { name: '团队头脑风暴', energy: 8, engagement: 9 }
  ]);

  // --- 处理函数 ---

  const handleSliderChange = (key, value) => {
    setDashboardData(prev => ({ ...prev, [key]: value }));
  };

  const handleOdysseyRatingChange = (metric, value) => {
    setOdysseyRatings(prev => ({
      ...prev,
      [activeOdyssey]: {
        ...prev[activeOdyssey],
        [metric]: value
      }
    }));
  };

  const addJournalEntry = () => {
    if (!journalEntry.name) return;
    setJournalList([...journalList, journalEntry]);
    setJournalEntry({ name: '', energy: 5, engagement: 5 });
  };

  const getDashboardFeedback = () => {
    const lowItems = Object.entries(dashboardData).filter(([_, val]) => val < 40);
    if (lowItems.length === 0) return "你的生活状态非常平衡！现在的挑战是如何保持这种状态并在细节上微调。";
    const names = lowItems.map(([k]) => k === 'health' ? '健康' : k === 'work' ? '工作' : k === 'play' ? '娱乐' : '爱').join('和');
    return `你的${names}储量较低。设计思维告诉我们：不要试图一次解决所有问题，先从其中一个小点开始，做一个微小的改变。`;
  };

  const getBarColor = (value) => {
    if (value < 30) return 'bg-red-400';
    if (value < 70) return 'bg-yellow-400';
    return 'bg-green-500';
  };

  // --- 数据常量 ---

  const odysseyPlans = [
    {
      title: "人生一：当前道路",
      desc: "你目前正在做的事情的延续，按部就班的未来。",
      detail: "这是你现在的职业轨迹延伸。如果在接下来的5年里，你继续做现在做的事，你会变成什么样？",
      icon: <Map className="w-8 h-8 text-blue-600" />,
      color: "bg-blue-50 border-blue-200",
      accent: "text-blue-600",
      barColor: "bg-blue-500"
    },
    {
      title: "人生二：备选方案",
      desc: "如果人生一突然行不通了（例如行业消失），你会做什么？",
      detail: "这不是备胎，而是当第一条路完全堵死（比如AI取代了你的工作）时，你必须做的事情。",
      icon: <RefreshCw className="w-8 h-8 text-purple-600" />,
      color: "bg-purple-50 border-purple-200",
      accent: "text-purple-600",
      barColor: "bg-purple-500"
    },
    {
      title: "人生三：狂野梦想",
      desc: "如果钱和面子都不是问题，你会做什么？",
      detail: "在这个版本里，你已经财务自由，也没人会嘲笑你。你想去南极种菜？想去火星开酒吧？",
      icon: <Lightbulb className="w-8 h-8 text-orange-600" />,
      color: "bg-orange-50 border-orange-200",
      accent: "text-orange-600",
      barColor: "bg-orange-500"
    }
  ];

  const mindsets = [
    { title: "好奇心", sub: "Curiosity", desc: "像孩子一样探索，不预设答案。", action: "今天尝试走一条不同的路回家，或者和一个陌生人交谈。" },
    { title: "试错", sub: "Bias to Action", desc: "先行动，再思考。通过尝试来验证。", action: "不要想那个计划了，今天就花15分钟做一个粗糙的版本。" },
    { title: "重构", sub: "Reframe", desc: "卡住时，换个角度看问题。", action: "把'我必须'改成'我选择'，看看感觉有什么不同。" },
    { title: "觉察", sub: "Awareness", desc: "意识到人生是过程，拥抱变化。", action: "接受今天发生的一件不顺心的事，告诉自己这也是过程的一部分。" },
    { title: "通力合作", sub: "Collaboration", desc: "人生不是独角戏，寻求帮助。", action: "今天找一个人，请求他给你一个小小的建议或帮助。" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* 头部区域 */}
      <header className="bg-gradient-to-r from-red-800 to-red-900 text-white py-12 px-4 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute right-10 top-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-wide">设计你的人生</h1>
          <h2 className="text-lg md:text-xl font-light text-red-200 mb-6">斯坦福最受欢迎的人生规划课</h2>
          <p className="text-base max-w-xl mx-auto leading-relaxed text-red-100 bg-red-900/30 p-4 rounded-lg backdrop-blur-sm border border-red-700/50">
            "人生不是规划出来的，而是设计出来的。用设计苹果手机的思维，重新设计你的人生。"
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-16">

        {/* 1. 核心理念与思维模式 (交互式卡片) */}
        <section>
          <div className="flex items-center gap-3 mb-6 justify-center">
            <div className="h-1 w-12 bg-red-600 rounded-full"></div>
            <h3 className="text-2xl font-bold text-slate-900">核心设计思维</h3>
            <div className="h-1 w-12 bg-red-600 rounded-full"></div>
          </div>
          <p className="text-center text-slate-600 mb-8 max-w-2xl mx-auto">
            点击下方的卡片，查看如何在日常生活中练习这些思维模式。
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {mindsets.map((m, idx) => (
              <div 
                key={idx} 
                onClick={() => setActiveMindset(activeMindset === idx ? null : idx)}
                className={`relative p-6 rounded-xl shadow-sm border cursor-pointer transition-all duration-300 h-48 flex flex-col justify-center items-center text-center
                  ${activeMindset === idx 
                    ? 'bg-red-600 text-white border-red-600 scale-105 shadow-xl rotate-y-180' 
                    : 'bg-white hover:border-red-300 hover:shadow-md border-slate-200'}`}
              >
                {activeMindset === idx ? (
                  <div className="animate-fade-in">
                    <h4 className="font-bold text-sm mb-2 text-red-100">今日练习</h4>
                    <p className="text-sm font-medium leading-relaxed">{m.action}</p>
                  </div>
                ) : (
                  <>
                    <h4 className="font-bold text-lg mb-1">{m.title}</h4>
                    <p className="text-xs opacity-60 mb-3 uppercase tracking-wider">{m.sub}</p>
                    <p className="text-xs text-slate-500">{m.desc}</p>
                    <p className="mt-4 text-xs text-red-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity">点击查看行动</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 2. 交互式仪表盘 (带反馈) */}
        <section className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-slate-100 px-8 py-4 border-b border-slate-200 flex justify-between items-center">
            <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800">
              <Activity className="text-red-600" size={24} />
              人生仪表盘 (The Dashboard)
            </h3>
            <span className="text-xs font-bold text-slate-500 bg-slate-200 px-3 py-1 rounded-full">第一步：体检</span>
          </div>
          
          <div className="p-8 md:p-12 flex flex-col lg:flex-row gap-12">
            {/* 控制区 */}
            <div className="flex-1 space-y-8">
              <p className="text-slate-600 text-sm">
                诚实地拖动滑块，评估你当前的能量状态。这能帮助你识别需要重点“设计”的领域。
              </p>
              
              <div className="space-y-6">
                {[
                  { key: 'health', label: '健康 (Health)', icon: <Activity size={18} /> },
                  { key: 'work', label: '工作 (Work)', icon: <Briefcase size={18} /> },
                  { key: 'play', label: '娱乐 (Play)', icon: <Smile size={18} /> },
                  { key: 'love', label: '爱 (Love)', icon: <Heart size={18} /> }
                ].map((item) => (
                  <div key={item.key}>
                    <div className="flex justify-between mb-2 text-sm font-bold text-slate-700">
                      <span className="flex items-center gap-2 text-slate-600">{item.icon} {item.label}</span>
                      <span className={`${getBarColor(dashboardData[item.key]).replace('bg-', 'text-')}`}>{dashboardData[item.key]}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={dashboardData[item.key]} 
                      onChange={(e) => handleSliderChange(item.key, parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 反馈区 */}
            <div className="flex-1 bg-slate-50 rounded-xl p-6 border border-slate-100 flex flex-col justify-between">
               <div>
                  <h4 className="font-bold text-slate-800 mb-4 border-b pb-2">诊断分析</h4>
                  <div className="flex gap-4 items-end h-32 mb-6">
                    {Object.entries(dashboardData).map(([key, value]) => (
                      <div key={key} className="flex-1 flex flex-col justify-end gap-1 group">
                        <div className="w-full bg-slate-200 rounded-t-sm relative overflow-hidden" style={{height: '100%'}}>
                           <div 
                              className={`absolute bottom-0 w-full transition-all duration-500 ${getBarColor(value)}`}
                              style={{ height: `${value}%` }}
                            ></div>
                        </div>
                        <span className="text-[10px] text-center font-bold text-slate-400 uppercase">{key}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                      💡 {getDashboardFeedback()}
                    </p>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* 3. 寻路指南针 & 好时光日志 (互动版) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* 指南针 */}
          <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <Compass size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">寻路指南针</h3>
            </div>
            
            <p className="text-sm text-slate-600 mb-6">
              当你的“工作观”（为什么工作）与“人生观”（人生的意义）一致时，你就找到了方向。
            </p>

            <div className="space-y-4 flex-1">
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <h5 className="text-xs font-bold text-blue-600 uppercase mb-2">反思问题</h5>
                <ul className="text-sm text-slate-700 space-y-2 list-disc list-inside">
                  <li>工作仅仅是为了赚钱，还是为了服务他人？</li>
                  <li>你觉得这种工作在这个世界上有什么意义？</li>
                  <li>这与你个人的价值观（如家庭、正义、成长）冲突吗？</li>
                </ul>
              </div>
              <div className="bg-blue-100 p-4 rounded-xl text-center">
                <p className="text-blue-800 font-bold text-sm">如果不一致，你能稍微调整航向吗？</p>
              </div>
            </div>
          </div>

          {/* 好时光日志 - 互动版 */}
          <div className="bg-green-50 p-8 rounded-2xl border border-green-100 flex flex-col">
             <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <Battery size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">好时光日志</h3>
            </div>

            <p className="text-sm text-slate-600 mb-4">
              记录那些让你充满能量（Energy）和全情投入（Engagement）的活动。
            </p>

            {/* 迷你日志输入器 */}
            <div className="bg-white p-4 rounded-xl shadow-sm mb-4 border border-green-100">
              <div className="flex gap-2 mb-3">
                <input 
                  type="text" 
                  placeholder="活动名称 (例: 开会)" 
                  className="flex-1 border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-500"
                  value={journalEntry.name}
                  onChange={(e) => setJournalEntry({...journalEntry, name: e.target.value})}
                />
                <button 
                  onClick={addJournalEntry}
                  className="bg-green-600 text-white rounded px-3 hover:bg-green-700 transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 font-bold block mb-1">专注度: {journalEntry.engagement}</label>
                  <input 
                    type="range" min="0" max="10" 
                    value={journalEntry.engagement}
                    onChange={(e) => setJournalEntry({...journalEntry, engagement: parseInt(e.target.value)})}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 font-bold block mb-1">能量: {journalEntry.energy}</label>
                  <input 
                    type="range" min="0" max="10" 
                    value={journalEntry.energy}
                    onChange={(e) => setJournalEntry({...journalEntry, energy: parseInt(e.target.value)})}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                </div>
              </div>
            </div>

            {/* 展示列表 */}
            <div className="flex-1 overflow-y-auto max-h-40 space-y-2 pr-2">
              {journalList.map((entry, idx) => (
                <div key={idx} className="flex justify-between items-center bg-white/60 p-2 rounded text-sm">
                  <span className="font-medium text-slate-700">{entry.name}</span>
                  <div className="flex gap-2 text-xs">
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">专注 {entry.engagement}</span>
                    <span className={`px-2 py-0.5 rounded ${entry.energy > 5 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      能量 {entry.energy}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* 4. 奥德赛计划 (深度互动版) */}
        <section>
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-2 text-slate-900">奥德赛计划 (Odyssey Plans)</h3>
            <p className="text-slate-600">为你的未来设计三个截然不同的版本，并对它们进行压力测试。</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 flex flex-col md:flex-row min-h-[500px]">
            {/* 左侧导航 */}
            <div className="w-full md:w-1/4 bg-slate-50 border-r border-slate-200 flex flex-row md:flex-col">
              {odysseyPlans.map((plan, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveOdyssey(idx)}
                  className={`flex-1 p-4 md:p-6 text-left transition-all duration-300 relative overflow-hidden group
                    ${activeOdyssey === idx 
                      ? 'bg-white shadow-sm z-10' 
                      : 'hover:bg-slate-100 text-slate-500'}`}
                >
                  <div className={`flex items-center gap-3 mb-1 ${activeOdyssey === idx ? plan.accent : ''}`}>
                    {plan.icon}
                    <span className="font-bold text-sm md:text-base hidden md:inline">Plan {idx + 1}</span>
                  </div>
                  <div className={`font-bold text-sm md:text-lg mb-1 leading-tight ${activeOdyssey === idx ? 'text-slate-800' : ''}`}>
                    {plan.title.split('：')[1]}
                  </div>
                  {activeOdyssey === idx && (
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${plan.barColor}`}></div>
                  )}
                </button>
              ))}
            </div>

            {/* 右侧内容 */}
            <div className="w-full md:w-3/4 p-6 md:p-10 flex flex-col">
              <div className="mb-8">
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-4 ${odysseyPlans[activeOdyssey].barColor}`}>
                  {odysseyPlans[activeOdyssey].title}
                </div>
                <h4 className="text-2xl font-bold text-slate-900 mb-2">{odysseyPlans[activeOdyssey].desc}</h4>
                <p className="text-slate-600 leading-relaxed">{odysseyPlans[activeOdyssey].detail}</p>
              </div>

              {/* 评估仪表盘 */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 mt-auto">
                <h5 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <BarChart2 size={18} />
                  计划评估仪表
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  {[
                    { id: 'resources', label: '我有资源吗?', sub: '(时间、金钱、人脉)' },
                    { id: 'like', label: '我喜欢吗?', sub: '(无论成败都享受)' },
                    { id: 'confidence', label: '我有信心吗?', sub: '(哪怕很难也能做到)' },
                    { id: 'coherence', label: '符合一致性吗?', sub: '(这就是我吗)' }
                  ].map((metric) => (
                    <div key={metric.id}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-bold text-slate-700">{metric.label}</span>
                        <span className="text-xs font-mono text-slate-500">{odysseyRatings[activeOdyssey][metric.id]}%</span>
                      </div>
                      <input 
                        type="range" min="0" max="100" 
                        value={odysseyRatings[activeOdyssey][metric.id]}
                        onChange={(e) => handleOdysseyRatingChange(metric.id, parseInt(e.target.value))}
                        className={`w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-600`}
                      />
                      <p className="text-[10px] text-slate-400 mt-1">{metric.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. 解决问题的策略 (重力问题 & 原型设计) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* 重力问题 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Anchor className="text-slate-400" size={24} />
              <h3 className="text-2xl font-bold text-slate-800">重力问题</h3>
            </div>
            <div className="bg-slate-100 p-6 rounded-xl border-l-4 border-slate-400 h-full">
              <p className="font-bold text-slate-800 mb-3 text-lg">"如果它不可被解决，那它就不是一个问题，而是一个事实。"</p>
              <ul className="text-sm text-slate-600 space-y-3 list-disc list-inside">
                <li><span className="font-bold text-slate-700">错误示范：</span> 我想当诗人，但诗人赚不到钱。（这是重力问题，你改变不了市场经济）</li>
                <li><span className="font-bold text-slate-700">正确重构：</span> 在必须通过其他方式维持生计的前提下，我如何最大化我的写诗时间？</li>
              </ul>
              <div className="mt-4 bg-white p-3 rounded border border-slate-200 text-xs text-slate-500">
                👉 <strong>操作：</strong> 接受现实（Accept），然后在现实的约束下进行设计。
              </div>
            </div>
          </div>

          {/* 原型设计 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Zap className="text-yellow-500" size={24} />
              <h3 className="text-2xl font-bold text-slate-800">原型设计</h3>
            </div>
            <div className="space-y-4">
              <div className="group flex items-start gap-4 p-5 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-all cursor-default">
                <div className="bg-yellow-100 p-3 rounded-lg text-yellow-700 font-bold">
                  <Users size={20} />
                </div>
                <div>
                  <h5 className="font-bold text-slate-800 mb-1">人生设计访谈</h5>
                  <p className="text-sm text-slate-500">
                    不要直接去面试。找到已经在做那个工作的人，请他喝杯咖啡，问他：“你典型的一天是怎么度过的？”听听故事。
                  </p>
                </div>
              </div>
              <div className="group flex items-start gap-4 p-5 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-all cursor-default">
                <div className="bg-yellow-100 p-3 rounded-lg text-yellow-700 font-bold">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <h5 className="font-bold text-slate-800 mb-1">微体验</h5>
                  <p className="text-sm text-slate-500">
                    想开餐厅？不要直接辞职开店。先去餐厅后厨帮工两周，或者搞一次周末私房菜活动。以最低成本试错。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 底部 */}
        <footer className="text-center pt-12 pb-20 border-t border-slate-200">
          <div className="max-w-2xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">永远不要停止设计</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              并没有一个完美的终点叫“原本的人生”。<br/>
              人生是不断构建的过程。保持好奇，不断尝试，经常重构。
            </p>
            <button className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-full transition-transform hover:scale-105 inline-flex items-center gap-2">
              重新开始评估 <RefreshCw size={16} />
            </button>
          </div>
        </footer>

      </main>
    </div>
  );
};

export default DYLPage;
