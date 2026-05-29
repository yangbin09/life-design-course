import { useState, useEffect } from 'react';
import { loadData, saveData } from '../utils/storage';

/**
 * 自定义 Hook：将状态同步到 localStorage
 * @param {string} key - 存储键名
 * @param {*} initialValue - 初始值
 * @returns {[*, Function]} - [值, 设置函数]
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    return loadData(key, initialValue);
  });

  useEffect(() => {
    saveData(key, storedValue);
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

export default useLocalStorage;
