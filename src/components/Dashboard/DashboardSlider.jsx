import React from 'react';
import { Activity, Briefcase, Smile, Heart } from 'lucide-react';
import { getCardStyle } from '../../styles/components';

const dimensionConfig = {
  health: {
    label: '健康 (Health)',
    labelShort: '健康',
    icon: (props) => <Activity {...props} />,
    description: '身体能量、睡眠质量、运动习惯'
  },
  work: {
    label: '工作 (Work)',
    labelShort: '工作',
    icon: (props) => <Briefcase {...props} />,
    description: '工作满足感、成长空间、收入满意度'
  },
  play: {
    label: '娱乐 (Play)',
    labelShort: '娱乐',
    icon: (props) => <Smile {...props} />,
    description: '兴趣爱好、放松方式、乐趣来源'
  },
  love: {
    label: '爱 (Love)',
    labelShort: '爱',
    icon: (props) => <Heart {...props} />,
    description: '亲密关系、家人连接、社交质量'
  }
};

const getBarColor = (value) => {
  if (value < 30) return 'bg-red-400';
  if (value < 50) return 'bg-orange-400';
  if (value < 70) return 'bg-yellow-400';
  return 'bg-green-500';
};

const getTextColor = (value) => {
  if (value < 30) return 'text-red-500';
  if (value < 50) return 'text-orange-500';
  if (value < 70) return 'text-yellow-600';
  return 'text-green-600';
};

/**
 * 仪表盘滑块控制组件
 * @param {Object} props
 * @param {Object} props.data - 四维度数据 { health, work, play, love }
 * @param {Function} props.onChange - 维度变更回调 (key, value) => void
 * @param {boolean} props.readOnly - 是否只读模式
 * @param {string} props.title - 标题（用于对比模式区分自评/他评）
 */
const DashboardSlider = ({ data, onChange, readOnly = false, title }) => {
  const dimensions = Object.entries(dimensionConfig);

  return (
    <div className="space-y-3">
      <style>{`
        .dashboard-slider::-webkit-slider-thumb {
          background: var(--color-primary) !important;
        }
        .dashboard-slider::-moz-range-thumb {
          background: var(--color-primary) !important;
          border: none;
        }
      `}</style>
      {title && (
        <h4 className="text-sm font-bold mb-4 pb-2" style={{ color: 'var(--color-text)', borderBottom: '1px solid var(--border-light)' }}>
          {title}
        </h4>
      )}
      {dimensions.map(([key, config]) => {
        const value = data[key] ?? 50;
        const IconComponent = config.icon;

        return (
          <div key={key} className="group">
            <div className="flex justify-between mb-1.5 text-sm">
              <span className="flex items-center gap-2 font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                <IconComponent size={16} style={{ color: 'var(--color-primary)' }} />
                <span className="hidden sm:inline">{config.label}</span>
                <span className="sm:hidden">{config.labelShort}</span>
              </span>
              <span className={`font-bold font-mono text-xs ${getTextColor(value)}`}>
                {value}%
              </span>
            </div>

            <div className="relative">
              <input
                type="range"
                min="0"
                max="100"
                value={value}
                onChange={(e) => onChange?.(key, parseInt(e.target.value))}
                disabled={readOnly}
                className={`dashboard-slider w-full h-2 rounded-lg appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-4
                  [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:shadow-md
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:transition-transform
                  [&::-webkit-slider-thumb]:hover:scale-125
                  ${readOnly ? 'opacity-70 cursor-default' : ''}`}
                style={{
                  background: `linear-gradient(to right, ${value < 30 ? '#f87171' : value < 50 ? '#fb923c' : value < 70 ? '#facc15' : '#22c55e'} 0%, ${value < 30 ? '#f87171' : value < 50 ? '#fb923c' : value < 70 ? '#facc15' : '#22c55e'} ${value}%, var(--color-bg-elevated) ${value}%, var(--color-bg-elevated) 100%)`,
                  ['--thumb-color']: 'var(--color-primary)',
                }}
              />
            </div>

            <p className="text-[10px] mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-text-muted)' }}>
              {config.description}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export { dimensionConfig, getBarColor, getTextColor };
export default DashboardSlider;
