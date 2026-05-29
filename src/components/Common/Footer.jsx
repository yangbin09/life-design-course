import React from 'react';
import { RefreshCw } from 'lucide-react';
import { getButtonStyle } from '../../styles/components';

/**
 * 页面底部组件
 * @param {Function} onRestart - 重新开始评估的回调函数
 */
const Footer = ({ onRestart }) => {
  const handleRestart = () => {
    if (onRestart) {
      onRestart();
    }
  };

  return (
    <footer className="text-center pt-12 pb-20 border-t border-[var(--border-light)]">
      <div className="max-w-2xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-[var(--color-text)] mb-6">
          永远不要停止设计
        </h2>
        <p className="text-[var(--color-text-secondary)] mb-8 leading-relaxed">
          并没有一个完美的终点叫"原本的人生"。
          <br />
          人生是不断构建的过程。保持好奇，不断尝试，经常重构。
        </p>
        <button
          onClick={handleRestart}
          className="font-bold py-3 px-8 rounded-[var(--radius-full)] transition-transform hover:scale-105 inline-flex items-center gap-2"
          style={getButtonStyle('primary')}
        >
          重新开始评估 <RefreshCw size={16} />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
