import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

/**
 * 统一的 AI 功能按钮
 */
const AIButton = ({ onClick, loading = false, disabled = false, children, size = 'sm', variant = 'primary' }) => {
  const sizeClasses = {
    xs: 'px-2 py-1 text-[10px]',
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-sm',
  };

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
      color: 'white',
      boxShadow: 'var(--shadow-warm)',
    },
    secondary: {
      background: 'var(--color-bg-elevated)',
      color: 'var(--color-primary)',
      border: 'var(--border-warm)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--color-primary)',
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center gap-1.5 rounded-lg font-medium transition-all duration-200 cursor-pointer ${sizeClasses[size]}`}
      style={{
        fontFamily: 'var(--font-body)',
        ...variants[variant],
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {loading ? (
        <Loader2 size={size === 'xs' ? 10 : 14} className="animate-spin" />
      ) : (
        <Sparkles size={size === 'xs' ? 10 : 14} />
      )}
      {children}
    </button>
  );
};

export default AIButton;
