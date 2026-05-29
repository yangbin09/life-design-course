import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

/**
 * 弹窗组件
 * @param {boolean} isOpen - 是否打开
 * @param {Function} onClose - 关闭回调
 * @param {string} title - 弹窗标题
 * @param {React.ReactNode} children - 弹窗内容
 * @param {string} size - 弹窗大小：'sm' | 'md' | 'lg' | 'xl'
 * @param {boolean} closeOnOverlay - 点击遮罩是否关闭，默认 true
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlay = true
}) => {
  const modalRef = useRef(null);

  const sizeMap = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  // ESC 键关闭
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* 遮罩 */}
      <div
        className="absolute inset-0 backdrop-blur-sm animate-fade-in"
        style={{ background: 'rgba(74, 55, 40, 0.5)' }}
        onClick={closeOnOverlay ? onClose : undefined}
      />

      {/* 弹窗内容 */}
      <div
        ref={modalRef}
        className={`relative ${sizeMap[size]} w-full mx-4 bg-[var(--color-bg-card)] rounded-2xl shadow-[var(--shadow-large)] animate-scale-in`}
      >
        {/* 头部 */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-light)]">
            <h3
              className="text-lg font-bold text-[var(--color-text)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {title}
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-elevated)] transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* 内容 */}
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
          {children}
        </div>

        {/* 无标题时的关闭按钮 */}
        {!title && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-elevated)] transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Modal;
