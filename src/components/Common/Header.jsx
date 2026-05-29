import React from 'react';

/**
 * 页面头部组件
 * 使用温暖自然风格设计
 */
const Header = () => {
  return (
    <header
      className="text-white py-12 px-4 relative overflow-hidden shadow-[var(--shadow-large)]"
      style={{ background: 'linear-gradient(to right, var(--color-primary), var(--color-accent))' }}
    >
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute right-10 top-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
      </div>
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h1
          className="text-4xl md:text-5xl font-bold mb-3 tracking-wide"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          设计你的人生
        </h1>
        <h2
          className="text-lg md:text-xl font-light mb-6"
          style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-body)' }}
        >
          斯坦福最受欢迎的人生规划课
        </h2>
        <p
          className="text-base max-w-xl mx-auto leading-relaxed p-4 rounded-lg backdrop-blur-sm"
          style={{
            color: 'rgba(255,255,255,0.9)',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            fontFamily: 'var(--font-body)',
          }}
        >
          "人生不是规划出来的，而是设计出来的。用设计苹果手机的思维，重新设计你的人生。"
        </p>
      </div>
    </header>
  );
};

export default Header;
