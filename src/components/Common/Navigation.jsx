import React, { useState, useEffect } from 'react';
import { navSections } from '../../data/initData';

/**
 * 锚点导航组件
 * 固定在页面顶部，支持平滑滚动到各个模块
 */
const Navigation = () => {
  const [activeSection, setActiveSection] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);

      // 检测当前可见的 section
      const sections = navSections.map(s => ({
        id: s.id,
        el: document.getElementById(s.id)
      })).filter(s => s.el);

      let current = '';
      for (const section of sections) {
        const rect = section.el.getBoundingClientRect();
        if (rect.top <= 120) {
          current = section.id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[var(--color-bg-card)]/95 backdrop-blur-sm shadow-[var(--shadow-medium)] border-b border-[var(--border-light)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-center gap-1 py-3 overflow-x-auto">
          {navSections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`px-4 py-2 rounded-[var(--radius-full)] text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activeSection === section.id
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-bg-elevated)]'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
