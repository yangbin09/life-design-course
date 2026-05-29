import React from 'react';

/**
 * 滑块组件
 * @param {number} value - 当前值
 * @param {Function} onChange - 值变化回调
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @param {string} label - 标签文字
 * @param {React.ReactNode} icon - 标签图标
 * @param {string} accentColor - 强调色：'default' | 'primary' | 'accent' | 'error'
 * @param {boolean} showValue - 是否显示当前值
 * @param {string} className - 额外的 CSS 类名
 */
const Slider = ({
  value,
  onChange,
  min = 0,
  max = 100,
  label,
  icon,
  accentColor = 'default',
  showValue = true,
  className = ''
}) => {
  // Map legacy color names to design system tokens
  const legacyColorMap = {
    green: 'primary',
    blue: 'primary',
    purple: 'accent',
    orange: 'accent',
    red: 'error',
  };

  const resolvedColor = legacyColorMap[accentColor] || accentColor;

  const accentStyleMap = {
    default: 'var(--color-text)',
    primary: 'var(--color-primary)',
    accent: 'var(--color-accent)',
    error: 'var(--color-error)',
  };

  const getDisplayColor = () => {
    if (resolvedColor === 'default') {
      if (value < 30) return 'var(--color-error)';
      if (value < 70) return 'var(--color-accent)';
      return 'var(--color-primary)';
    }
    return accentStyleMap[resolvedColor] || 'var(--color-text-secondary)';
  };

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="flex justify-between mb-2 text-sm font-bold text-[var(--color-text)]">
          {label && (
            <span className="flex items-center gap-2 text-[var(--color-text-secondary)]">
              {icon} {label}
            </span>
          )}
          {showValue && (
            <span style={{ color: getDisplayColor() }}>{value}%</span>
          )}
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className={`w-full h-2 rounded-lg appearance-none cursor-pointer`}
        style={{
          background: 'var(--color-bg-elevated)',
          accentColor: accentStyleMap[resolvedColor] || 'var(--color-text)',
        }}
      />
    </div>
  );
};

export default Slider;
