import React from 'react';

/**
 * 章节标题组件
 * @param {string} title - 标题文字
 * @param {string} subtitle - 副标题（可选）
 * @param {string} align - 对齐方式：'center' | 'left'，默认 'center'
 * @param {React.ReactNode} icon - 图标（可选）
 * @param {string} badge - 标签文字（可选）
 */
const SectionTitle = ({ title, subtitle, align = 'center', icon, badge }) => {
  const isCenter = align === 'center';

  return (
    <div className={`mb-8 ${isCenter ? 'text-center' : ''}`}>
      {badge && (
        <div className={`${isCenter ? 'flex items-center gap-3 justify-center' : 'flex items-center gap-3'} mb-4`}>
          {isCenter && (
            <div
              className="h-1 w-12 rounded-full"
              style={{ background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))' }}
            ></div>
          )}
          <span
            className="text-xs font-bold px-3 py-1 rounded-[var(--radius-full)]"
            style={{ color: 'var(--color-text-muted)', background: 'var(--color-bg-elevated)' }}
          >
            {badge}
          </span>
          {isCenter && (
            <div
              className="h-1 w-12 rounded-full"
              style={{ background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))' }}
            ></div>
          )}
        </div>
      )}

      <div className={`${isCenter ? 'flex items-center gap-3 justify-center' : 'flex items-center gap-3'} mb-2`}>
        {!badge && isCenter && (
          <div
            className="h-1 w-12 rounded-full"
            style={{ background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))' }}
          ></div>
        )}
        {icon && <span style={{ color: 'var(--color-primary)' }}>{icon}</span>}
        <h3
          className={`${badge ? 'text-xl' : 'text-2xl md:text-3xl'} font-bold`}
          style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
        >
          {title}
        </h3>
        {!badge && isCenter && (
          <div
            className="h-1 w-12 rounded-full"
            style={{ background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))' }}
          ></div>
        )}
      </div>

      {subtitle && (
        <p
          className="max-w-2xl mx-auto leading-relaxed"
          style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
