import React, { useState } from 'react';
import { Download, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { exportData, importData } from '../../utils/storage';
import Modal from './Modal';

/**
 * 数据导出导入组件
 * @param {Function} onExport - 导出时调用，应返回要导出的数据对象
 * @param {Function} onImport - 导入时调用，传入导入的数据
 * @param {Function} onReset - 重置数据的回调
 */
const ExportImport = ({ onExport, onImport, onReset }) => {
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState(null);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleExport = () => {
    try {
      const data = onExport();
      const exportPayload = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        data
      };
      exportData(exportPayload, `life-design-backup-${new Date().toISOString().slice(0, 10)}.json`);
      showMessage('success', '数据导出成功！');
    } catch (error) {
      showMessage('error', '导出失败：' + error.message);
    }
  };

  const handleImport = async () => {
    try {
      const imported = await importData();
      if (!imported || !imported.data) {
        throw new Error('无效的备份文件');
      }
      onImport(imported.data);
      showMessage('success', '数据导入成功！');
      setShowModal(false);
    } catch (error) {
      if (error.message !== 'No file selected') {
        showMessage('error', '导入失败：' + error.message);
      }
    }
  };

  const handleReset = () => {
    if (window.confirm('确定要重置所有数据吗？此操作不可撤销。')) {
      onReset();
      showMessage('success', '数据已重置');
      setShowModal(false);
    }
  };

  return (
    <>
      {/* 数据管理按钮 */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 z-40 bg-[var(--color-text)] hover:bg-[var(--color-text-secondary)] text-[var(--color-bg)] rounded-full p-4 shadow-[var(--shadow-medium)] hover:shadow-[var(--shadow-large)] transition-all hover:scale-105 flex items-center gap-2"
        title="数据管理"
      >
        <Download size={20} />
        <span className="hidden sm:inline text-sm font-medium">数据管理</span>
      </button>

      {/* 消息提示 */}
      {message && (
        <div
          className={`fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-[var(--shadow-medium)] text-sm font-medium animate-slide-in-right ${
            message.type === 'success'
              ? 'bg-[var(--color-primary)] text-white'
              : 'bg-[var(--color-error)] text-white'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          {message.text}
        </div>
      )}

      {/* 数据管理弹窗 */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="数据管理"
        size="md"
      >
        <div className="space-y-6">
          <p className="text-sm text-[var(--color-text-secondary)]">
            管理你的人生设计数据。你可以导出备份、导入之前的数据，或重置为初始状态。
          </p>

          <div className="space-y-3">
            {/* 导出 */}
            <button
              onClick={handleExport}
              className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-[var(--border-light)] hover:border-[var(--color-primary)] hover:bg-[var(--color-bg-elevated)] transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-lg bg-[var(--color-bg-elevated)] flex items-center justify-center text-[var(--color-primary)] group-hover:bg-[var(--color-secondary)]">
                <Download size={20} />
              </div>
              <div>
                <p className="font-bold text-[var(--color-text)]">导出数据</p>
                <p className="text-xs text-[var(--color-text-muted)]">下载 JSON 备份文件</p>
              </div>
            </button>

            {/* 导入 */}
            <button
              onClick={handleImport}
              className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-[var(--border-light)] hover:border-[var(--color-primary)] hover:bg-[var(--color-bg-elevated)] transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-lg bg-[var(--color-bg-elevated)] flex items-center justify-center text-[var(--color-primary)] group-hover:bg-[var(--color-secondary)]">
                <Upload size={20} />
              </div>
              <div>
                <p className="font-bold text-[var(--color-text)]">导入数据</p>
                <p className="text-xs text-[var(--color-text-muted)]">从备份文件恢复数据</p>
              </div>
            </button>

            {/* 重置 */}
            <button
              onClick={handleReset}
              className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-[var(--border-light)] hover:border-[var(--color-error)] hover:bg-[var(--color-bg-elevated)] transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-lg bg-[var(--color-bg-elevated)] flex items-center justify-center text-[var(--color-error)] group-hover:bg-[var(--color-secondary)]">
                <AlertCircle size={20} />
              </div>
              <div>
                <p className="font-bold text-[var(--color-text)]">重置数据</p>
                <p className="text-xs text-[var(--color-text-muted)]">清除所有数据并恢复默认</p>
              </div>
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ExportImport;
