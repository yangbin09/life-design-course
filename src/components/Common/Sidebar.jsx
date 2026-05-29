import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  Map,
  Lightbulb,
  Anchor,
  GitBranch,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Heart,
  BookOpen,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import useProgress from '../../hooks/useProgress';
import useAIConfig from '../../hooks/useAIConfig';

const navItems = [
  {
    path: '/',
    label: '总览',
    icon: LayoutDashboard,
    description: '人生设计概览',
    module: null
  },
  {
    path: '/dashboard',
    label: '人生仪表盘',
    icon: Heart,
    description: '评估健康、工作、娱乐、爱',
    module: 'dashboard'
  },
  {
    path: '/compass',
    label: '寻路指南针',
    icon: Compass,
    description: '工作观与人生观对齐',
    module: 'compass'
  },
  {
    path: '/journal',
    label: '好时光日志',
    icon: BookOpen,
    description: '记录能量与专注度',
    module: 'journal'
  },
  {
    path: '/odyssey',
    label: '奥德赛计划',
    icon: Map,
    description: '设计三个版本的人生',
    module: 'odyssey'
  },
  {
    path: '/prototype',
    label: '原型设计',
    icon: Lightbulb,
    description: '访谈与微体验',
    module: 'prototype'
  },
  {
    path: '/journey',
    label: '人生旅程',
    icon: GitBranch,
    description: '追踪设计进度',
    module: 'journey'
  }
];

const Sidebar = ({ onOpenAISettings }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const location = useLocation();
  const { isModuleCompleted, getCompletionRate } = useProgress();
  const { isConfigured } = useAIConfig();

  const toggleCollapse = () => setCollapsed(!collapsed);
  const toggleMobile = () => setMobileOpen(!mobileOpen);
  const closeMobile = () => setMobileOpen(false);

  const completionRate = getCompletionRate();

  return (
    <>
      {/* 移动端汉堡菜单按钮 */}
      <button
        onClick={toggleMobile}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl transition-all duration-200 active:scale-95"
        style={{
          background: 'var(--color-bg-card)',
          border: 'var(--border-warm)',
          boxShadow: 'var(--shadow-medium)'
        }}
      >
        {mobileOpen ? (
          <X size={20} style={{ color: 'var(--color-primary)' }} />
        ) : (
          <Menu size={20} style={{ color: 'var(--color-primary)' }} />
        )}
      </button>

      {/* 移动端遮罩 */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 backdrop-blur-sm"
          style={{ background: 'rgba(74, 55, 40, 0.3)' }}
          onClick={closeMobile}
        />
      )}

      {/* 侧边栏 */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-40
          transition-all duration-300 ease-out
          ${collapsed ? 'w-20' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          sidebar
        `}
      >
        {/* Logo 区域 */}
        <div
          className={`p-4 ${collapsed ? 'px-4' : 'px-6'}`}
          style={{ borderBottom: 'var(--border-light)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-warm)'
              }}
            >
              <Heart className="text-white" size={20} />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <h1
                  className="font-bold truncate"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: 'var(--color-text)',
                    fontSize: '1.25rem'
                  }}
                >
                  设计你的人生
                </h1>
                <p
                  className="text-xs truncate"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Life Design Course
                </p>
              </div>
            )}
          </div>

          {/* 进度条 */}
          {!collapsed && (
            <div className="mt-4">
              <div
                className="flex items-center justify-between text-xs mb-2"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.875rem' }}>
                  完成进度
                </span>
                <span className="font-bold" style={{ color: 'var(--color-primary)' }}>
                  {completionRate}%
                </span>
              </div>
              <div className="warm-progress">
                <div
                  className="warm-progress-bar"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* 导航菜单 */}
        <nav className="p-3 space-y-1 overflow-y-auto" style={{ height: 'calc(100% - 200px)' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const isCompleted = item.module && isModuleCompleted(item.module);

            return (
              <div
                key={item.path}
                className="relative"
                onMouseEnter={() => setHoveredItem(item.path)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <NavLink
                  to={item.path}
                  onClick={closeMobile}
                  className={`
                    flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
                    ${isActive ? 'sidebar-nav-item active' : 'sidebar-nav-item'}
                    ${collapsed ? 'justify-center' : ''}
                  `}
                >
                  <div
                    className="w-10 h-10 flex items-center justify-center flex-shrink-0 rounded-lg transition-all duration-200"
                    style={{
                      background: isActive ? 'rgba(255,255,255,0.2)' : 'var(--color-bg-elevated)',
                      borderRadius: 'var(--radius-md)'
                    }}
                  >
                    <Icon
                      size={20}
                      style={{ color: isActive ? 'white' : 'var(--color-primary)' }}
                    />
                  </div>

                  {!collapsed && (
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-medium text-sm truncate"
                          style={{
                            fontFamily: 'var(--font-heading)',
                            color: isActive ? 'white' : 'var(--color-text)',
                            fontSize: '0.9375rem'
                          }}
                        >
                          {item.label}
                        </span>
                        {isCompleted && (
                          <CheckCircle2
                            size={14}
                            style={{ color: isActive ? 'rgba(255,255,255,0.7)' : 'var(--color-success)' }}
                          />
                        )}
                      </div>
                      <div
                        className="text-xs truncate"
                        style={{
                          color: isActive ? 'rgba(255,255,255,0.7)' : 'var(--color-text-muted)'
                        }}
                      >
                        {item.description}
                      </div>
                    </div>
                  )}

                  {!collapsed && isActive && (
                    <div
                      className="w-1.5 h-8 rounded-full flex-shrink-0"
                      style={{
                        background: 'rgba(255,255,255,0.3)',
                        borderRadius: 'var(--radius-full)'
                      }}
                    />
                  )}
                </NavLink>

                {/* 折叠状态下的 Tooltip */}
                {collapsed && hoveredItem === item.path && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50">
                    <div
                      className="px-4 py-3 whitespace-nowrap"
                      style={{
                        background: 'var(--color-text)',
                        color: 'var(--color-bg)',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: 'var(--shadow-large)'
                      }}
                    >
                      <div
                        className="font-bold"
                        style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem' }}
                      >
                        {item.label}
                      </div>
                      <div
                        className="text-xs mt-1"
                        style={{ color: 'var(--color-text-light)' }}
                      >
                        {item.description}
                      </div>
                      {isCompleted && (
                        <div
                          className="text-xs mt-1"
                          style={{ color: 'var(--color-success)' }}
                        >
                          ✓ 已完成
                        </div>
                      )}
                    </div>
                    <div
                      className="absolute right-full top-1/2 -translate-y-1/2"
                      style={{
                        width: 0,
                        height: 0,
                        borderTop: '6px solid transparent',
                        borderBottom: '6px solid transparent',
                        borderRight: '6px solid var(--color-text)'
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* 底部设置区域 */}
        <div
          className="absolute bottom-0 left-0 right-0 p-3 space-y-1"
          style={{ borderTop: 'var(--border-light)' }}
        >
          {/* AI 设置按钮 */}
          <button
            onClick={onOpenAISettings}
            className={`
              w-full flex items-center gap-3 px-3 py-3 rounded-xl
              transition-all duration-200 cursor-pointer
              ${collapsed ? 'justify-center' : ''}
            `}
            style={{ color: 'var(--color-text-muted)' }}
          >
            <div
              className="w-10 h-10 flex items-center justify-center flex-shrink-0"
              style={{
                background: isConfigured
                  ? 'linear-gradient(135deg, var(--color-primary), var(--color-accent))'
                  : 'var(--color-bg-elevated)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <Sparkles size={20} style={{ color: isConfigured ? 'white' : 'var(--color-text-muted)' }} />
            </div>
            {!collapsed && (
              <span
                className="text-sm font-medium"
                style={{ fontFamily: 'var(--font-heading)', fontSize: '0.875rem' }}
              >
                AI 设置
              </span>
            )}
          </button>

          {/* 收起侧边栏按钮 */}
          <button
            onClick={toggleCollapse}
            className={`
              w-full flex items-center gap-3 px-3 py-3 rounded-xl
              transition-all duration-200 cursor-pointer
              ${collapsed ? 'justify-center' : ''}
            `}
            style={{ color: 'var(--color-text-muted)' }}
          >
            <div
              className="w-10 h-10 flex items-center justify-center flex-shrink-0"
              style={{
                background: 'var(--color-bg-elevated)',
                borderRadius: 'var(--radius-md)'
              }}
            >
              {collapsed ? (
                <ChevronRight size={20} />
              ) : (
                <ChevronLeft size={20} />
              )}
            </div>
            {!collapsed && (
              <span
                className="text-sm font-medium"
                style={{ fontFamily: 'var(--font-heading)', fontSize: '0.875rem' }}
              >
                收起侧边栏
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* 主内容区域的左边距占位 */}
      <div
        className={`hidden lg:block flex-shrink-0 transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      />
    </>
  );
};

export default Sidebar;
