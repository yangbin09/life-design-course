import React from 'react';

/**
 * 通用卡片组件
 * @param {React.ReactNode} children - 卡片内容
 * @param {string} variant - 卡片样式变体：'default' | 'elevated' | 'flat' | 'outlined'
 * @param {string} padding - 内边距大小：'sm' | 'md' | 'lg'
 * @param {string} className - 额外的 CSS 类名
 * @param {Function} onClick - 点击事件（可选，点击时卡片变为可交互样式）
 * @param {boolean} active - 是否为激活状态
 * @param {string} activeClassName - 激活状态的样式类名
 */
const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  onClick,
  active = false,
  activeClassName = '',
}) => {
  const baseClasses = 'rounded-xl transition-all duration-300';

  const variantClasses = {
    default: 'bg-[var(--color-bg-card)] shadow-[var(--shadow-soft)] border border-[var(--border-light)]',
    elevated: 'bg-[var(--color-bg-card)] shadow-[var(--shadow-medium)] border border-[var(--border-light)]',
    flat: 'bg-[var(--color-bg-elevated)]',
    outlined: 'bg-[var(--color-bg-card)] border-2 border-[var(--border-warm)]'
  };

  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const interactiveClasses = onClick
    ? 'cursor-pointer hover:shadow-[var(--shadow-medium)] hover:border-[var(--color-primary)]'
    : '';

  const activeClasses = active
    ? activeClassName || 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] scale-105 shadow-[var(--shadow-large)]'
    : '';

  const classes = [
    baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    interactiveClasses,
    activeClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(e);
        }
      } : undefined}
    >
      {children}
    </div>
  );
};

export default Card;
