import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * 页面切换过渡动画组件
 */
const PageTransition = ({ children }) => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div
      className={`
        transition-all duration-300 ease-out
        ${isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4'
        }
      `}
    >
      {children}
    </div>
  );
};

export default PageTransition;
