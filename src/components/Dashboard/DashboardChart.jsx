import React from 'react';
import { Activity, Briefcase, Smile, Heart } from 'lucide-react';
import { getBarColor } from './DashboardSlider';
import { getCardStyle, getTitleStyle } from '../../styles/components';

const dimensionMeta = {
  health: { label: '健康', labelEn: 'HEALTH', icon: Activity },
  work: { label: '工作', labelEn: 'WORK', icon: Briefcase },
  play: { label: '娱乐', labelEn: 'PLAY', icon: Smile },
  love: { label: '爱', labelEn: 'LOVE', icon: Heart }
};

/**
 * 四维度柱状图组件
 * 使用纯 div 实现，不引入图表库
 */
const DashboardChart = ({ data, height = 200, showLabels = true, animate = true }) => {
  const maxVal = 100;
  const entries = Object.entries(dimensionMeta);

  return (
    <div className="w-full">
      {/* 图表区域 */}
      <div
        className="flex items-end justify-around gap-3 px-2"
        style={{ height: `${height}px` }}
      >
        {entries.map(([key, meta]) => {
          const value = data[key] ?? 0;
          const barHeight = (value / maxVal) * 100;
          const IconComponent = meta.icon;

          return (
            <div key={key} className="flex-1 flex flex-col items-center h-full justify-end group">
              {/* 数值标签 */}
              <span className="text-xs font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-text-secondary)' }}>
                {value}
              </span>

              {/* 柱状条 */}
              <div className="w-full max-w-[60px] rounded-t-md relative overflow-hidden" style={{ height: '100%', background: 'var(--color-bg-elevated)' }}>
                <div
                  className={`absolute bottom-0 w-full rounded-t-md transition-all ${animate ? 'duration-700 ease-out' : 'duration-0'} ${getBarColor(value)}`}
                  style={{ height: `${barHeight}%` }}
                />
                {/* 内部网格线 */}
                {[25, 50, 75].map(pct => (
                  <div
                    key={pct}
                    className="absolute w-full border-t border-white/30"
                    style={{ bottom: `${pct}%` }}
                  />
                ))}
              </div>

              {/* 底部标签 */}
              {showLabels && (
                <div className="mt-2 flex flex-col items-center">
                  <IconComponent size={14} className="mb-0.5" style={{ color: 'var(--color-text-muted)' }} />
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                    {meta.labelEn}
                  </span>
                  <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                    {meta.label}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 底部基线 */}
      <div className="h-px mx-2 mt-1" style={{ background: 'var(--border-light)' }} />
    </div>
  );
};

/**
 * 雷达/蛛网图风格的圆形仪表盘
 * 用 SVG 实现四维度环形展示
 */
export const DashboardRadar = ({ data, size = 180 }) => {
  const center = size / 2;
  const radius = size / 2 - 20;
  const entries = Object.entries(data);
  const angleStep = (2 * Math.PI) / entries.length;
  const startAngle = -Math.PI / 2; // 从顶部开始

  const colors = {
    health: '#22c55e',
    work: '#3b82f6',
    play: '#f59e0b',
    love: '#ef4444'
  };

  const labels = {
    health: '健康',
    work: '工作',
    play: '娱乐',
    love: '爱'
  };

  // 计算多边形顶点
  const getPoint = (value, index) => {
    const angle = startAngle + index * angleStep;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  // 背景网格
  const gridLevels = [25, 50, 75, 100];
  const gridPolygons = gridLevels.map(level => {
    const points = entries.map((_, i) => {
      const angle = startAngle + i * angleStep;
      const r = (level / 100) * radius;
      return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
    });
    return points.join(' ');
  });

  // 数据多边形
  const dataPoints = entries.map(([key, val], i) => getPoint(val, i));
  const dataPolygon = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  // 标签位置
  const labelPoints = entries.map(([key], i) => {
    const angle = startAngle + i * angleStep;
    const r = radius + 14;
    return {
      key,
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
      label: labels[key]
    };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {/* 网格 */}
      {gridPolygons.map((points, i) => (
        <polygon
          key={i}
          points={points}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="1"
          opacity={i === gridLevels.length - 1 ? 0.5 : 0.3}
        />
      ))}

      {/* 轴线 */}
      {entries.map((_, i) => {
        const angle = startAngle + i * angleStep;
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={center + radius * Math.cos(angle)}
            y2={center + radius * Math.sin(angle)}
            stroke="#e2e8f0"
            strokeWidth="1"
          />
        );
      })}

      {/* 数据区域 */}
      <polygon
        points={dataPolygon}
        fill="rgba(239, 68, 68, 0.15)"
        stroke="#ef4444"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* 数据点 */}
      {dataPoints.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="4"
          fill={Object.values(colors)[i]}
          stroke="white"
          strokeWidth="2"
        />
      ))}

      {/* 标签 */}
      {labelPoints.map(lp => (
        <text
          key={lp.key}
          x={lp.x}
          y={lp.y}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-[10px] font-bold"
          fill="var(--color-text-secondary)"
        >
          {lp.label}
        </text>
      ))}
    </svg>
  );
};

export default DashboardChart;
