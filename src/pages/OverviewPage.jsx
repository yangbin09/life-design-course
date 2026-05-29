import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Compass,
  BookOpen,
  Map,
  Lightbulb,
  GitBranch,
  ArrowRight,
  TrendingUp,
  Calendar,
  Target,
  Zap,
  Sparkles,
  Sun
} from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import AIInsights from '../components/AI/AIInsights';

const OverviewPage = () => {
  const [dashboardData] = useLocalStorage('life-design-dashboard-current', {
    health: 60,
    work: 60,
    play: 60,
    love: 60
  });

  const [journalEntries] = useLocalStorage('life-design-journal-entries', []);

  const modules = [
    {
      title: '人生仪表盘',
      description: '评估你在健康、工作、娱乐、爱四个维度的能量状态',
      icon: Heart,
      path: '/dashboard',
      color: 'var(--color-health)',
      bgGradient: 'linear-gradient(135deg, #C46B5C, #D4956F)',
      stats: `${Math.round(Object.values(dashboardData).reduce((a, b) => a + b, 0) / 4)}% 平均能量`
    },
    {
      title: '寻路指南针',
      description: '对齐你的工作观与人生观，找到人生方向',
      icon: Compass,
      path: '/compass',
      color: 'var(--color-primary)',
      bgGradient: 'linear-gradient(135deg, #C67B5C, #B5651D)',
      stats: '探索人生方向'
    },
    {
      title: '好时光日志',
      description: '记录让你充满能量和全情投入的活动',
      icon: BookOpen,
      path: '/journal',
      color: 'var(--color-accent)',
      bgGradient: 'linear-gradient(135deg, #6B7B3C, #8A9D4F)',
      stats: `已记录 ${journalEntries.length} 条`
    },
    {
      title: '奥德赛计划',
      description: '设计三个截然不同的人生版本并进行压力测试',
      icon: Map,
      path: '/odyssey',
      color: 'var(--color-secondary)',
      bgGradient: 'linear-gradient(135deg, #B5651D, #C97D3A)',
      stats: '3个版本的人生'
    },
    {
      title: '原型设计',
      description: '通过人生设计访谈和微体验低成本试错',
      icon: Lightbulb,
      path: '/prototype',
      color: 'var(--color-work)',
      bgGradient: 'linear-gradient(135deg, #D4A574, #E0B896)',
      stats: '行动验证想法'
    },
    {
      title: '人生旅程',
      description: '追踪你的人生设计进度，回顾成长轨迹',
      icon: GitBranch,
      path: '/journey',
      color: 'var(--color-love)',
      bgGradient: 'linear-gradient(135deg, #C48B7C, #D4A596)',
      stats: '记录成长轨迹'
    }
  ];

  const getBarColor = (value) => {
    if (value < 30) return 'var(--color-health)';
    if (value < 70) return 'var(--color-work)';
    return 'var(--color-success)';
  };

  const dimensions = [
    { key: 'health', label: '健康', icon: '💪', color: 'var(--color-health)' },
    { key: 'work', label: '工作', icon: '💼', color: 'var(--color-work)' },
    { key: 'play', label: '娱乐', icon: '🎮', color: 'var(--color-play)' },
    { key: 'love', label: '爱', icon: '❤️', color: 'var(--color-love)' }
  ];

  return (
    <div className="space-y-8 page-container">
      {/* 欢迎区域 */}
      <div className="welcome-banner p-8 md:p-10 text-white relative">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Sun size={20} className="animate-float" style={{ color: 'rgba(255,255,255,0.8)' }} />
            <span
              className="text-sm font-medium"
              style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-body)' }}
            >
              斯坦福最受欢迎的人生规划课
            </span>
          </div>
          <h1
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem' }}
          >
            欢迎来到人生设计课
          </h1>
          <p
            className="text-lg mb-8 max-w-2xl leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.9)' }}
          >
            "人生不是规划出来的，而是设计出来的。用设计苹果手机的思维，重新设计你的人生。"
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/dashboard"
              className="btn-cta inline-flex items-center gap-2"
              style={{
                background: 'rgba(255,255,255,0.95)',
                color: 'var(--color-primary-dark)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 28px',
                fontWeight: '700',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}
            >
              开始评估 <ArrowRight size={18} />
            </Link>
            <Link
              to="/odyssey"
              className="inline-flex items-center gap-2 px-6 py-3 font-medium transition-all duration-200 hover:bg-white/20"
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                borderRadius: 'var(--radius-md)',
                border: '2px solid rgba(255,255,255,0.3)',
                fontFamily: 'var(--font-body)',
                fontWeight: '600'
              }}
            >
              设计人生计划
            </Link>
          </div>
        </div>
      </div>

      {/* 快速状态概览 */}
      <div className="card p-6">
        <h2
          className="text-lg font-bold mb-5 flex items-center gap-2"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)', fontSize: '1.5rem' }}
        >
          <TrendingUp size={22} style={{ color: 'var(--color-primary)' }} />
          当前人生能量状态
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {dimensions.map((dim) => (
            <div key={dim.key} className="text-center">
              <div className="text-4xl mb-3">{dim.icon}</div>
              <div
                className="text-sm font-semibold mb-2"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)', fontSize: '1rem' }}
              >
                {dim.label}
              </div>
              <div className="status-bar mb-2">
                <div
                  className="status-bar-fill"
                  style={{
                    width: `${dashboardData[dim.key]}%`,
                    background: `linear-gradient(90deg, ${dim.color}, ${dim.color}dd)`
                  }}
                />
              </div>
              <div
                className="text-2xl font-bold"
                style={{ fontFamily: 'var(--font-heading)', color: dim.color }}
              >
                {dashboardData[dim.key]}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI 洞察 */}
      <AIInsights />

      {/* 模块卡片网格 */}
      <div>
        <h2
          className="text-lg font-bold mb-5 flex items-center gap-2"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)', fontSize: '1.5rem' }}
        >
          <Target size={22} style={{ color: 'var(--color-primary)' }} />
          人生设计工具箱
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((module, index) => {
            const Icon = module.icon;
            return (
              <Link
                key={module.path}
                to={module.path}
                className="module-card p-5 group block"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="icon-container flex-shrink-0"
                    style={{ background: module.bgGradient }}
                  >
                    <Icon size={24} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-bold mb-1 transition-colors duration-200 group-hover:opacity-80"
                      style={{
                        fontFamily: 'var(--font-heading)',
                        color: 'var(--color-text)',
                        fontSize: '1.125rem'
                      }}
                    >
                      {module.title}
                    </h3>
                    <p
                      className="text-sm mb-3 line-clamp-2"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      {module.description}
                    </p>
                    <div className="badge">
                      {module.stats}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 今日提示 */}
      <div className="card p-6">
        <h2
          className="text-lg font-bold mb-4 flex items-center gap-2"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)', fontSize: '1.5rem' }}
        >
          <Zap size={22} style={{ color: 'var(--color-work)' }} />
          今日设计思维练习
        </h2>
        <div className="tip-box">
          <h3
            className="font-bold mb-2"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', fontSize: '1.25rem' }}
          >
            好奇心 (Curiosity)
          </h3>
          <p
            className="text-sm mb-4"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            像孩子一样探索，不预设答案。
          </p>
          <div
            className="p-4 rounded-lg"
            style={{
              background: 'var(--color-bg)',
              borderRadius: 'var(--radius-md)',
              border: 'var(--border-light)'
            }}
          >
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              💡 今天尝试走一条不同的路回家，或者和一个陌生人交谈。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
