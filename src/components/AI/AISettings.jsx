import React, { useState } from 'react';
import { Settings, Eye, EyeOff, Wifi, WifiOff, RotateCcw, Check, X } from 'lucide-react';
import useAIConfig from '../../hooks/useAIConfig';
import { getCardStyle, getButtonStyle } from '../../styles/components';

const AISettings = ({ isOpen, onClose }) => {
  const {
    config,
    updateConfig,
    resetConfig,
    testConnection,
    testStatus,
    testing,
    isConfigured,
  } = useAIConfig();

  const [showKey, setShowKey] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(74, 55, 40, 0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl p-6 max-w-lg w-full mx-4"
        style={{ ...getCardStyle(true), boxShadow: 'var(--shadow-large)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' }}
            >
              <Settings size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
                AI 设置
              </h3>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                配置 OpenAI 兼容的 API 接口
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          {/* API Key */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}>
              API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={config.apiKey}
                onChange={e => updateConfig({ apiKey: e.target.value })}
                placeholder="sk-..."
                className="w-full px-4 py-2.5 pr-10 rounded-xl text-sm transition-all"
                style={{
                  background: 'var(--color-bg)',
                  border: 'var(--border-warm)',
                  color: 'var(--color-text)',
                  fontFamily: 'var(--font-body)',
                }}
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Base URL */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}>
              API 地址
            </label>
            <input
              type="text"
              value={config.baseUrl}
              onChange={e => updateConfig({ baseUrl: e.target.value })}
              placeholder="https://api.deepseek.com/v1"
              className="w-full px-4 py-2.5 rounded-xl text-sm transition-all"
              style={{
                background: 'var(--color-bg)',
                border: 'var(--border-warm)',
                color: 'var(--color-text)',
                fontFamily: 'var(--font-body)',
              }}
            />
            <p className="text-[10px] mt-1" style={{ color: 'var(--color-text-muted)' }}>
              支持 DeepSeek、通义千问、Moonshot 等兼容 OpenAI 格式的 API
            </p>
          </div>

          {/* Model */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}>
              模型名称
            </label>
            <input
              type="text"
              value={config.model}
              onChange={e => updateConfig({ model: e.target.value })}
              placeholder="deepseek-chat"
              className="w-full px-4 py-2.5 rounded-xl text-sm transition-all"
              style={{
                background: 'var(--color-bg)',
                border: 'var(--border-warm)',
                color: 'var(--color-text)',
                fontFamily: 'var(--font-body)',
              }}
            />
          </div>

          {/* Temperature */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}>
              创造性 (Temperature): {config.temperature}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={config.temperature}
              onChange={e => updateConfig({ temperature: parseFloat(e.target.value) })}
              className="w-full"
              style={{ accentColor: 'var(--color-primary)' }}
            />
            <div className="flex justify-between text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
              <span>精确</span>
              <span>创造</span>
            </div>
          </div>

          {/* 测试结果 */}
          {testStatus && (
            <div
              className="p-3 rounded-xl text-sm"
              style={{
                background: testStatus.success ? 'rgba(198,123,92,0.1)' : 'rgba(198,123,92,0.05)',
                border: `1px solid ${testStatus.success ? 'var(--color-primary)' : 'var(--color-error)'}`,
                color: testStatus.success ? 'var(--color-primary)' : 'var(--color-error)',
                fontFamily: 'var(--font-body)',
              }}
            >
              {testStatus.message}
            </div>
          )}
        </div>

        {/* 底部按钮 */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={testConnection}
            disabled={testing || !config.apiKey}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer"
            style={{
              ...getButtonStyle('primary'),
              opacity: testing || !config.apiKey ? 0.5 : 1,
            }}
          >
            {testing ? (
              <>
                <RotateCcw size={14} className="animate-spin" />
                测试中...
              </>
            ) : (
              <>
                {testStatus?.success ? <Check size={14} /> : <Wifi size={14} />}
                测试连接
              </>
            )}
          </button>
          <button
            onClick={resetConfig}
            className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer"
            style={{
              ...getButtonStyle('secondary'),
            }}
          >
            重置
          </button>
        </div>

        {/* 使用说明 */}
        <div
          className="mt-4 p-3 rounded-xl text-[11px] leading-relaxed"
          style={{
            background: 'var(--color-bg-elevated)',
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-body)',
          }}
        >
          <p className="font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>使用说明：</p>
          <ul className="space-y-0.5 list-disc list-inside">
            <li>API Key 仅存储在本地浏览器，不会上传到任何服务器</li>
            <li>推荐使用 DeepSeek API（性价比高，中文效果好）</li>
            <li>其他兼容接口：通义千问、Moonshot、智谱等</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AISettings;
