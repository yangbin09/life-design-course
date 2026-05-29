import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus, Calendar } from 'lucide-react';
import { getCardStyle } from '../../styles/components';

const dimensionColors = {
  health: { stroke: '#22c55e', fill: 'rgba(34, 197, 94, 0.1)', label: '健康' },
  work: { stroke: '#3b82f6', fill: 'rgba(59, 130, 246, 0.1)', label: '工作' },
  play: { stroke: '#f59e0b', fill: 'rgba(245, 158, 11, 0.1)', label: '娱乐' },
  love: { stroke: '#ef4444', fill: 'rgba(239, 68, 68, 0.1)', label: '爱' }
};

/**
 * 折线图组件 - 使用 SVG 实现
 */
const LineChart = ({ datasets, width = 500, height = 200, showGrid = true }) => {
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  // 找出所有数据点的最大数量
  const maxPoints = Math.max(...datasets.map(d => d.points.length), 1);

  // X/Y 映射函数
  const getX = (index) => {
    if (maxPoints <= 1) return padding.left + chartW / 2;
    return padding.left + (index / (maxPoints - 1)) * chartW;
  };
  const getY = (value) => padding.top + chartH - (value / 100) * chartH;

  // 网格线 Y 值
  const gridYValues = [0, 25, 50, 75, 100];

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      className="overflow-visible"
    >
      {/* 背景网格 */}
      {showGrid && gridYValues.map(val => {
        const y = getY(val);
        return (
          <g key={val}>
            <line
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke="#e2e8f0"
              strokeWidth="1"
              strokeDasharray={val === 0 || val === 100 ? 'none' : '4,4'}
            />
            <text
              x={padding.left - 8}
              y={y + 3}
              textAnchor="end"
              className="text-[9px]"
              fill="var(--color-text-muted)"
            >
              {val}
            </text>
          </g>
        );
      })}

      {/* X 轴标签 */}
      {datasets[0]?.labels?.map((label, i) => (
        <text
          key={i}
          x={getX(i)}
          y={height - 5}
          textAnchor="middle"
          className="text-[9px]"
          fill="var(--color-text-muted)"
        >
          {label}
        </text>
      ))}

      {/* 各维度折线 */}
      {datasets.map((dataset, di) => {
        if (dataset.points.length === 0) return null;
        const color = dimensionColors[dataset.key] || { stroke: '#94a3b8', fill: 'rgba(148, 163, 184, 0.1)' };

        // 构建折线路径
        const linePath = dataset.points
          .map((val, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(val)}`)
          .join(' ');

        // 构建填充区域路径
        const areaPath = linePath +
          ` L ${getX(dataset.points.length - 1)} ${getY(0)}` +
          ` L ${getX(0)} ${getY(0)} Z`;

        return (
          <g key={dataset.key}>
            {/* 填充区域 */}
            <path d={areaPath} fill={color.fill} />
            {/* 折线 */}
            <path
              d={linePath}
              fill="none"
              stroke={color.stroke}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* 数据点 */}
            {dataset.points.map((val, i) => (
              <g key={i}>
                <circle
                  cx={getX(i)}
                  cy={getY(val)}
                  r="3"
                  fill="white"
                  stroke={color.stroke}
                  strokeWidth="2"
                />
                {/* Hover 区域 */}
                <circle
                  cx={getX(i)}
                  cy={getY(val)}
                  r="10"
                  fill="transparent"
                  className="cursor-pointer"
                >
                  <title>{`${dataset.label}: ${val}% (${dataset.labels?.[i] || ''})`}</title>
                </circle>
              </g>
            ))}
          </g>
        );
      })}
    </svg>
  );
};

/**
 * 趋势图表组件
 * 展示四维度历史变化趋势
 */
const DashboardTrend = ({ history, getTrendData }) => {
  const [timeRange, setTimeRange] = useState('all');
  const [activeDimensions, setActiveDimensions] = useState(
    new Set(['health', 'work', 'play', 'love'])
  );

  const timeRanges = [
    { key: 'all', label: '全部' },
    { key: 'year', label: '一年' },
    { key: 'month', label: '一月' },
    { key: 'week', label: '一周' }
  ];

  // 获取过滤后的历史数据
  const filteredHistory = useMemo(() => {
    if (timeRange === 'all') return history;
    const now = new Date();
    let cutoff;
    if (timeRange === 'week') cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    else if (timeRange === 'month') cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    else cutoff = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    return history.filter(h => new Date(h.timestamp) >= cutoff);
  }, [history, timeRange]);

  // 构建图表数据集
  const datasets = useMemo(() => {
    const dimensions = ['health', 'work', 'play', 'love'];
    const dimensionLabels = { health: '健康', work: '工作', play: '娱乐', love: '爱' };

    return dimensions
      .filter(dim => activeDimensions.has(dim))
      .map(dim => ({
        key: dim,
        label: dimensionLabels[dim],
        points: filteredHistory.map(h => h.data[dim]),
        labels: filteredHistory.map(h => {
          const d = new Date(h.timestamp);
          return `${d.getMonth() + 1}/${d.getDate()}`;
        })
      }));
  }, [filteredHistory, activeDimensions]);

  // 计算趋势统计
  const trendStats = useMemo(() => {
    if (filteredHistory.length < 2) return null;

    const dimensions = ['health', 'work', 'play', 'love'];
    const dimensionLabels = { health: '健康', work: '工作', play: '娱乐', love: '爱' };

    return dimensions.map(dim => {
      const values = filteredHistory.map(h => h.data[dim]);
      const first = values[0];
      const last = values[values.length - 1];
      const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
      const min = Math.min(...values);
      const max = Math.max(...values);
      const change = last - first;

      return {
        key: dim,
        label: dimensionLabels[dim],
        current: last,
        change,
        avg,
        min,
        max,
        trend: change > 5 ? 'up' : change < -5 ? 'down' : 'stable'
      };
    });
  }, [filteredHistory]);

  const toggleDimension = (dim) => {
    setActiveDimensions(prev => {
      const next = new Set(prev);
      if (next.has(dim)) {
        if (next.size > 1) next.delete(dim); // 至少保留一个
      } else {
        next.add(dim);
      }
      return next;
    });
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar size={32} className="mx-auto mb-3" style={{ color: 'var(--color-text-muted)' }} />
        <p className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>暂无历史数据</p>
        <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>保存评估后，趋势图表将在此显示</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 时间范围选择 */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold flex items-center gap-1.5" style={{ color: 'var(--color-text)' }}>
          <TrendingUp size={14} style={{ color: 'var(--color-primary)' }} />
          历史趋势
        </h4>
        <div className="flex gap-1 rounded-lg p-0.5" style={{ background: 'var(--color-bg-elevated)' }}>
          {timeRanges.map(tr => (
            <button
              key={tr.key}
              onClick={() => setTimeRange(tr.key)}
              className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-colors ${
                timeRange === tr.key
                  ? 'shadow-sm'
                  : ''
              }`}
              style={timeRange === tr.key
                ? { background: 'var(--color-bg-card)', color: 'var(--color-primary)' }
                : { color: 'var(--color-text-secondary)' }}
            >
              {tr.label}
            </button>
          ))}
        </div>
      </div>

      {/* 维度切换标签 */}
      <div className="flex gap-2 flex-wrap">
        {Object.entries(dimensionColors).map(([key, config]) => (
          <button
            key={key}
            onClick={() => toggleDimension(key)}
            className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all ${
              activeDimensions.has(key)
                ? 'border-current text-white'
                : ''
            }`}
            style={activeDimensions.has(key) ? {
              backgroundColor: config.stroke,
              borderColor: config.stroke
            } : { borderColor: 'var(--border-light)', color: 'var(--color-text-muted)', background: 'var(--color-bg-card)' }}
          >
            {config.label}
          </button>
        ))}
      </div>

      {/* 折线图 */}
      {filteredHistory.length > 0 ? (
        <div className="rounded-xl p-3" style={getCardStyle(true)}>
          <LineChart
            datasets={datasets}
            height={180}
            width={500}
          />
        </div>
      ) : (
        <div className="text-center py-8 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          所选时间范围内无数据
        </div>
      )}

      {/* 趋势统计卡片 */}
      {trendStats && (
        <div className="grid grid-cols-2 gap-2">
          {trendStats.map(stat => (
            <div
              key={stat.key}
              className="rounded-lg p-3 hover:shadow-sm transition-shadow"
              style={getCardStyle()}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold" style={{ color: 'var(--color-text)' }}>{stat.label}</span>
                {stat.trend === 'up' && <TrendingUp size={12} className="text-green-500" />}
                {stat.trend === 'down' && <TrendingDown size={12} className="text-red-500" />}
                {stat.trend === 'stable' && <Minus size={12} style={{ color: 'var(--color-text-muted)' }} />}
              </div>
              <div className="flex items-end gap-2">
                <span className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>{stat.current}</span>
                <span className={`text-xs font-bold mb-0.5 ${
                  stat.change > 0 ? 'text-green-600' : stat.change < 0 ? 'text-red-600' : ''
                }`}
                style={stat.change === 0 ? { color: 'var(--color-text-muted)' } : undefined}>
                  {stat.change > 0 ? '+' : ''}{stat.change}
                </span>
              </div>
              <div className="text-[10px] mt-1" style={{ color: 'var(--color-text-muted)' }}>
                均值 {stat.avg} | 范围 {stat.min}-{stat.max}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 数据点数量提示 */}
      <p className="text-[10px] text-center" style={{ color: 'var(--color-text-muted)' }}>
        共 {filteredHistory.length} 条记录
        {timeRange !== 'all' && ` (筛选自 ${history.length} 条总记录)`}
      </p>
    </div>
  );
};

export default DashboardTrend;
