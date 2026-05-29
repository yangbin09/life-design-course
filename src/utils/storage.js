// 本地存储工具函数

/**
 * 从 localStorage 读取数据
 * @param {string} key - 存储键名
 * @param {*} defaultValue - 默认值
 * @returns {*}
 */
export const loadData = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(`life-design-${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading data for key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * 保存数据到 localStorage
 * @param {string} key - 存储键名
 * @param {*} value - 要存储的值
 */
export const saveData = (key, value) => {
  try {
    localStorage.setItem(`life-design-${key}`, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving data for key "${key}":`, error);
  }
};

/**
 * 删除 localStorage 中的数据
 * @param {string} key - 存储键名
 */
export const removeData = (key) => {
  try {
    localStorage.removeItem(`life-design-${key}`);
  } catch (error) {
    console.error(`Error removing data for key "${key}":`, error);
  }
};

/**
 * 导出所有数据为 JSON 文件
 * @param {Object} data - 要导出的数据
 * @param {string} filename - 文件名
 */
export const exportData = (data, filename = 'life-design-backup.json') => {
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * 从 JSON 文件导入数据
 * @returns {Promise<Object>}
 */
export const importData = () => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) {
        reject(new Error('No file selected'));
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          resolve(data);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    };
    input.click();
  });
};

/**
 * 获取当前时间戳
 * @returns {string}
 */
export const getTimestamp = () => {
  return new Date().toISOString();
};

/**
 * 生成唯一 ID
 * @returns {string}
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
