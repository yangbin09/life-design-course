import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 布局组件
import Sidebar from './components/Common/Sidebar';
import ExportImport from './components/Common/ExportImport';
import ScrollToTop from './components/Common/ScrollToTop';
import PageTransition from './components/Common/PageTransition';

// AI 组件
import { AIProvider } from './contexts/AIContext';
import AIAssistant from './components/AI/AIAssistant';
import AISettings from './components/AI/AISettings';
import AIOnboarding from './components/AI/AIOnboarding';

// 页面组件
import OverviewPage from './pages/OverviewPage';
import DashboardPage from './pages/DashboardPage';
import CompassPage from './pages/CompassPage';
import JournalPage from './pages/JournalPage';
import OdysseyPage from './pages/OdysseyPage';
import PrototypePage from './pages/PrototypePage';
import JourneyPage from './pages/JourneyPage';

// 工具函数
import { removeData } from './utils/storage';

/**
 * 设计你的人生 - 主应用
 * 基于《斯坦福人生设计课》的交互式 Web 应用
 * 采用侧边栏导航式布局
 */
const App = () => {
  const [showAISettings, setShowAISettings] = useState(false);

  // 数据管理
  const handleExport = () => {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('life-design-')) {
        try {
          data[key] = JSON.parse(localStorage.getItem(key));
        } catch (e) {
          data[key] = localStorage.getItem(key);
        }
      }
    }
    return data;
  };

  const handleImport = (data) => {
    Object.entries(data).forEach(([key, value]) => {
      localStorage.setItem(key, JSON.stringify(value));
    });
    window.location.reload();
  };

  const handleReset = () => {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('life-design-')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    window.location.reload();
  };

  return (
    <Router>
      <AIProvider>
      <ScrollToTop />
      <div
        className="min-h-screen flex"
        style={{
          background: 'var(--color-bg)',
          fontFamily: 'var(--font-body)',
          color: 'var(--color-text)',
        }}
      >
        {/* 侧边栏导航 */}
        <Sidebar onOpenAISettings={() => setShowAISettings(true)} />

        {/* 主内容区域 */}
        <main className="flex-1 min-w-0">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <PageTransition>
              <Routes>
                <Route path="/" element={<OverviewPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/compass" element={<CompassPage />} />
                <Route path="/journal" element={<JournalPage />} />
                <Route path="/odyssey" element={<OdysseyPage />} />
                <Route path="/prototype" element={<PrototypePage />} />
                <Route path="/journey" element={<JourneyPage />} />
              </Routes>
            </PageTransition>
          </div>
        </main>

        {/* 数据管理浮窗 */}
        <ExportImport
          onExport={handleExport}
          onImport={handleImport}
          onReset={handleReset}
        />

        {/* AI 助手浮窗 */}
        <AIAssistant />

        {/* AI 设置弹窗 */}
        <AISettings
          isOpen={showAISettings}
          onClose={() => setShowAISettings(false)}
        />

        {/* AI 入门引导 */}
        <AIOnboarding />
      </div>
      </AIProvider>
    </Router>
  );
};

export default App;
