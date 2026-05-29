import { useLocalStorage } from './useLocalStorage';

/**
 * 追踪各模块完成进度的Hook
 */
export const useProgress = () => {
  const [progress, setProgress] = useLocalStorage('life-design-progress', {
    dashboard: { completed: false, lastVisit: null },
    compass: { completed: false, lastVisit: null },
    journal: { completed: false, lastVisit: null },
    odyssey: { completed: false, lastVisit: null },
    prototype: { completed: false, lastVisit: null },
    journey: { completed: false, lastVisit: null }
  });

  const markVisited = (module) => {
    setProgress(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        lastVisit: new Date().toISOString()
      }
    }));
  };

  const markCompleted = (module) => {
    setProgress(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        completed: true,
        lastVisit: new Date().toISOString()
      }
    }));
  };

  const getCompletionRate = () => {
    const modules = Object.keys(progress);
    const completed = modules.filter(m => progress[m].completed).length;
    return Math.round((completed / modules.length) * 100);
  };

  const isModuleCompleted = (module) => {
    return progress[module]?.completed || false;
  };

  return {
    progress,
    markVisited,
    markCompleted,
    getCompletionRate,
    isModuleCompleted
  };
};

export default useProgress;
