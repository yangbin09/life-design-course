import React, { useEffect, useRef } from 'react';

/**
 * 流式文本渲染组件 - 打字机效果
 */
const AIStreamingText = ({ text, loading = false, className = '' }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [text]);

  if (!text && !loading) return null;

  return (
    <div
      ref={containerRef}
      className={`text-sm leading-relaxed whitespace-pre-wrap ${className}`}
      style={{
        fontFamily: 'var(--font-body)',
        color: 'var(--color-text)',
      }}
    >
      {text}
      {loading && (
        <span
          className="inline-block w-1.5 h-4 ml-0.5 animate-pulse"
          style={{ background: 'var(--color-primary)', verticalAlign: 'text-bottom' }}
        />
      )}
    </div>
  );
};

export default AIStreamingText;
