import React from 'react';

/**
 * 进度条组件
 * @param {number} value - 当前值 (0-100)
 * @param {string} color - 颜色主题：'auto' | 'primary' | 'accent' | 'error'
 * @param {string} size - 高度：'sm' | 'md' | 'lg'
 * @param {boolean} showLabel - 是否显示百分比标签
 * @param {string} labelPosition - 标签位置：'right' | 'top' | 'inside'
 * @param {string} className - 额外的 CSS 类名
 */
const ProgressBar = ({
  value = 0,
  color = 'auto',
  size = 'md',
  showLabel = false,
  labelPosition = 'right',
  className = ''
}) => {
  const getAutoColor = (val) => {
    if (val < 30) return 'error';
    if (val < 70) return 'accent';
    return 'primary';
  };

  const resolvedColor = color === 'auto' ? getAutoColor(value) : color;

  const colorMap = {
    primary: { bar: 'var(--color-primary)', text: 'var(--color-primary)', bg: 'var(--color-bg-elevated)' },
    accent: { bar: 'var(--color-accent)', text: 'var(--color-accent)', bg: 'var(--color-bg-elevated)' },
    error: { bar: 'var(--color-error)', text: 'var(--color-error)', bg: 'var(--color-bg-elevated)' },
    secondary: { bar: 'var(--color-secondary)', text: 'var(--color-text-secondary)', bg: 'var(--color-bg-elevated)' },
  };

  // Legacy color support mapped to design system
  const legacyColorMap = {
    red: 'error',
    yellow: 'accent',
    green: 'primary',
    blue: 'primary',
    purple: 'accent',
    orange: 'accent',
    slate: 'secondary',
  };

  const mappedColor = legacyColorMap[resolvedColor] || resolvedColor;
  const colors = colorMap[mappedColor] || colorMap.primary;

  const sizeMap = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const bar = (
    <div
      className={`w-full rounded-full overflow-hidden ${sizeMap[size]} ${className}`}
      style={{ background: colors.bg }}
    >
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${Math.min(100, Math.max(0, value))}%`,
          background: colors.bar,
        }}
      />
    </div>
  );

  if (!showLabel) return bar;

  if (labelPosition === 'top') {
    return (
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-xs font-bold" style={{ color: colors.text }}>{value}%</span>
        </div>
        {bar}
      </div>
    );
  }

  if (labelPosition === 'inside') {
    return (
      <div className="relative">
        {bar}
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow">
          {value}%
        </span>
      </div>
    );
  }

  // labelPosition === 'right'
  return (
    <div className="flex items-center gap-2">
      {bar}
      <span
        className="text-xs font-mono font-bold min-w-[2.5rem] text-right"
        style={{ color: colors.text }}
      >
        {value}%
      </span>
    </div>
  );
};

/**
 * 垂直柱状图组件（用于仪表盘诊断区域）
 */
export const VerticalBar = ({ value, label, color = 'auto' }) => {
  const getAutoColor = (val) => {
    if (val < 30) return 'var(--color-error)';
    if (val < 70) return 'var(--color-accent)';
    return 'var(--color-primary)';
  };

  const barColor = color === 'auto' ? getAutoColor(value) : color;

  return (
    <div className="flex-1 flex flex-col justify-end gap-1 group">
      <div
        className="w-full rounded-t-sm relative overflow-hidden"
        style={{ height: '100%', background: 'var(--color-bg-elevated)' }}
      >
        <div
          className="absolute bottom-0 w-full transition-all duration-500"
          style={{ height: `${value}%`, background: barColor }}
        />
      </div>
      <span
        className="text-[10px] text-center font-bold uppercase"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {label}
      </span>
    </div>
  );
};

export default ProgressBar;
