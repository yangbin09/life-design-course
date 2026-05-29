import React from 'react';

/**
 * 统一的页面容器组件 - 温暖自然风格
 */
const PageContainer = ({ title, description, badge, children }) => {
  return (
    <div className="page-container">
      {/* 页面标题区域 */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <h1
            className="text-2xl font-bold"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text)',
              fontSize: '2rem'
            }}
          >
            {title}
          </h1>
          {badge && (
            <span className="badge">
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p
            className="text-base leading-relaxed max-w-2xl"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {description}
          </p>
        )}
        <div
          className="mt-4 h-1 w-16"
          style={{
            background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary-light))',
            borderRadius: 'var(--radius-full)'
          }}
        />
      </div>

      {/* 页面内容 */}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
