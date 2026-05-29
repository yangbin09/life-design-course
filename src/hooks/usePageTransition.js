import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * 页面切换时滚动到顶部的Hook
 */
export const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
};

export default useScrollToTop;
