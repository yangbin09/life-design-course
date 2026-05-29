import React from 'react';
import { FileText, Save, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { getCardStyle, getButtonStyle, getTitleStyle, getDescStyle } from '../../styles/components';

const CompassWriting = ({ workView, lifeView, onUpdateWork, onUpdateLife, onSaveVersion, history }) => {
  const [expandedHistory, setExpandedHistory] = React.useState(false);

  const renderWritingPanel = (type, data, onUpdate) => {
    const isWork = type === 'work';
    const panelBg = isWork ? 'rgba(198, 123, 92, 0.08)' : 'rgba(198, 123, 92, 0.15)';
    const panelBorder = isWork ? 'rgba(198, 123, 92, 0.25)' : 'rgba(198, 123, 92, 0.35)';

    return (
      <div className="rounded-2xl p-6 flex flex-col" style={{ background: panelBg, border: `1px solid ${panelBorder}` }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText size={20} style={{ color: 'var(--color-primary)' }} />
            <h4 className="font-bold text-lg" style={{ color: 'var(--color-primary)' }}>{data.title}</h4>
          </div>
          <button
            onClick={() => onSaveVersion(type)}
            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors"
            style={getButtonStyle('primary')}
          >
            <Save size={14} /> 保存版本
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm mb-3" style={{ color: 'var(--color-text-secondary)' }}>思考以下问题，写下你的回答：</p>
          <ul className="space-y-2">
            {data.questions.map((q, i) => (
              <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--color-text)' }}>
                <span className="font-bold mt-0.5" style={{ color: 'var(--color-primary)' }}>{i + 1}.</span>
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </div>

        <textarea
          value={data.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          placeholder="在这里写下你的思考..."
          className="flex-1 min-h-[200px] w-full p-4 rounded-xl border text-sm resize-y focus:outline-none focus:ring-2 focus:border-transparent"
          style={{ background: 'var(--color-bg-card)', borderColor: 'var(--border-light)', color: 'var(--color-text)', '--tw-ring-color': 'var(--color-primary)' }}
        />

        <div className="mt-3 text-right">
          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {data.content.length} 字
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="mb-2" style={getTitleStyle('xl')}>工作观与人生观</h3>
        <p className="text-sm max-w-xl mx-auto" style={getDescStyle()}>
          当你的工作观（为什么工作）与人生观（人生的意义）一致时，你就找到了方向。反复书写和迭代，让它们逐渐清晰。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderWritingPanel('work', workView, onUpdateWork)}
        {renderWritingPanel('life', lifeView, onUpdateLife)}
      </div>

      {/* 历史版本 */}
      {history.length > 0 && (
        <div className="overflow-hidden" style={getCardStyle()}>
          <button
            onClick={() => setExpandedHistory(!expandedHistory)}
            className="w-full flex items-center justify-between p-4 transition-colors"
            style={{ color: 'var(--color-text)' }}
          >
            <span className="font-bold flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
              <RotateCcw size={16} style={{ color: 'var(--color-primary)' }} />
              历史版本 ({history.length})
            </span>
            {expandedHistory ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {expandedHistory && (
            <div className="max-h-64 overflow-y-auto" style={{ borderTop: '1px solid var(--border-light)' }}>
              {history.map((entry) => (
                <div key={entry.id} className="p-4" style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded" style={{
                      background: entry.type === 'work' ? 'rgba(198, 123, 92, 0.15)' : 'rgba(198, 123, 92, 0.25)',
                      color: 'var(--color-primary)'
                    }}>
                      {entry.type === 'work' ? '工作观' : '人生观'}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      {new Date(entry.timestamp).toLocaleDateString('zh-CN', {
                        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-sm line-clamp-3" style={{ color: 'var(--color-text-secondary)' }}>{entry.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CompassWriting;
