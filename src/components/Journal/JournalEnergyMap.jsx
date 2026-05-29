import React, { useState, useMemo } from 'react';
import { Maximize2, Minimize2, Info } from 'lucide-react';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../../hooks/useJournal';
import { getCardStyle } from '../../styles/components';

/**
 * 好时光日志能量地图
 * 散点图展示：X轴专注度，Y轴能量值
 * 用圆形div实现，不同位置和大小表示不同数据
 */
const JournalEnergyMap = ({ data, entries }) => {
  const [expanded, setExpanded] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // 分类过滤
  const filteredData = useMemo(() => {
    if (selectedCategory === 'all') return data;
    return data.filter(d => d.category === selectedCategory);
  }, [data, selectedCategory]);

  // 统计各象限
  const stats = useMemo(() => {
    const total = filteredData.length;
    const flow = filteredData.filter(d => d.quadrant === 'highBoth').length;
    const highEng = filteredData.filter(d => d.quadrant === 'highEngagement').length;
    const highEne = filteredData.filter(d => d.quadrant === 'highEnergy').length;
    const lowBoth = filteredData.filter(d => d.quadrant === 'lowBoth').length;
    return { total, flow, highEng, highEne, lowBoth };
  }, [filteredData]);

  // 获取所有分类
  const categories = useMemo(() => {
    const cats = new Set(entries.map(e => e.category));
    return Array.from(cats);
  }, [entries]);

  // 获取散点大小（基于能量+专注度的综合值）
  const getDotSize = (entry) => {
    const score = entry.x + entry.y;
    if (score >= 16) return 'w-5 h-5 md:w-6 md:h-6';
    if (score >= 12) return 'w-4 h-4 md:w-5 md:h-5';
    if (score >= 8) return 'w-3.5 h-3.5 md:w-4 md:h-4';
    return 'w-3 h-3';
  };

  // 获取散点颜色（使用温暖色系，保持数据可区分性）
  const getDotColor = (entry) => {
    if (entry.isFlow) return { background: 'var(--color-primary)', boxShadow: '0 2px 8px rgba(198, 123, 92, 0.4)' };
    if (entry.quadrant === 'highEngagement') return { background: 'var(--color-accent)', boxShadow: '0 2px 8px rgba(181, 101, 29, 0.3)' };
    if (entry.quadrant === 'highEnergy') return { background: 'var(--color-secondary)', boxShadow: '0 2px 8px rgba(212, 196, 168, 0.4)' };
    return { background: 'var(--color-text-muted)', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' };
  };

  if (data.length === 0) {
    return (
      <div
        className="rounded-xl p-6 text-center"
        style={{ ...getCardStyle(), border: 'var(--border-light)' }}
      >
        <div
          className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center"
          style={{ background: 'var(--color-bg-elevated)' }}
        >
          <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5">
            <circle cx="12" cy="12" r="2" />
            <circle cx="6" cy="8" r="1.5" />
            <circle cx="18" cy="16" r="1.5" />
          </svg>
        </div>
        <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>能量地图需要更多数据</p>
        <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>记录活动后，这里会展示你的心流分布</p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl overflow-hidden transition-all duration-300 ${expanded ? 'col-span-full' : ''}`}
      style={{ ...getCardStyle(), border: 'var(--border-light)' }}
    >
      {/* 标题栏 */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: 'var(--border-light)' }}
      >
        <h4
          className="text-sm font-bold flex items-center gap-2"
          style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--color-primary)' }}>
            <circle cx="12" cy="12" r="2" fill="currentColor" />
            <circle cx="6" cy="8" r="1.5" fill="currentColor" opacity="0.6" />
            <circle cx="18" cy="16" r="1.5" fill="currentColor" opacity="0.6" />
          </svg>
          能量地图
        </h4>
        <div className="flex items-center gap-2">
          {/* 分类过滤 */}
          {categories.length > 1 && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-[10px] border-0 rounded px-2 py-1 focus:outline-none cursor-pointer"
              style={{ background: 'var(--color-bg-elevated)', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}
            >
              <option value="all">全部分类</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{CATEGORY_LABELS[cat] || cat}</option>
              ))}
            </select>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)'; }}
          >
            {expanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* 散点图 */}
      <div className="p-4">
        <div
          className="relative rounded-lg"
          style={{ background: 'var(--color-bg-elevated)', border: 'var(--border-light)', height: expanded ? '400px' : '280px' }}
        >
          {/* Y轴标签 */}
          <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between py-2 text-center">
            <span className="text-[9px] font-medium" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>10</span>
            <span className="text-[9px] font-medium" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>能量</span>
            <span className="text-[9px] font-medium" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>0</span>
          </div>

          {/* X轴标签 */}
          <div className="absolute bottom-0 left-8 right-0 h-6 flex items-center justify-between px-2">
            <span className="text-[9px]" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>0</span>
            <span className="text-[9px] font-medium" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>专注度</span>
            <span className="text-[9px]" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>10</span>
          </div>

          {/* 网格线 */}
          <div className="absolute inset-8 bottom-6">
            {/* 水平网格线 */}
            {[0, 25, 50, 75, 100].map((pct) => (
              <div
                key={`h-${pct}`}
                className="absolute left-0 right-0"
                style={{ bottom: `${pct}%`, borderTop: '1px solid var(--border-light)' }}
              />
            ))}
            {/* 垂直网格线 */}
            {[0, 25, 50, 75, 100].map((pct) => (
              <div
                key={`v-${pct}`}
                className="absolute top-0 bottom-0"
                style={{ left: `${pct}%`, borderLeft: '1px solid var(--border-light)' }}
              />
            ))}

            {/* 心流区域高亮 */}
            <div
              className="absolute rounded-lg"
              style={{
                left: '65%',
                right: '0',
                bottom: '65%',
                top: '0',
                border: '2px dashed var(--color-primary)',
                background: 'rgba(198, 123, 92, 0.06)',
              }}
            />
            <div
              className="absolute right-1 top-1 text-[8px] font-medium px-1 rounded"
              style={{ color: 'var(--color-primary)', background: 'rgba(255, 255, 255, 0.8)', fontFamily: 'var(--font-body)' }}
            >
              心流区
            </div>

            {/* 耗能区域 */}
            <div
              className="absolute rounded-lg"
              style={{
                left: '65%',
                right: '0',
                bottom: '0',
                top: '35%',
                border: '2px dashed var(--color-error)',
                background: 'rgba(200, 80, 80, 0.04)',
              }}
            />
            <div
              className="absolute right-1 bottom-1 text-[8px] font-medium px-1 rounded"
              style={{ color: 'var(--color-error)', background: 'rgba(255, 255, 255, 0.8)', fontFamily: 'var(--font-body)' }}
            >
              高压区
            </div>

            {/* 散点 */}
            {filteredData.map((point) => {
              // 将 0-10 的值映射到百分比位置
              const xPos = (point.x / 10) * 100;
              const yPos = (point.y / 10) * 100;
              const entry = entries.find(e => e.id === point.id);

              return (
                <div
                  key={point.id}
                  className="absolute group/dot"
                  style={{
                    left: `${xPos}%`,
                    bottom: `${yPos}%`,
                    transform: 'translate(-50%, 50%)'
                  }}
                  onMouseEnter={() => setHoveredId(point.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* 散点 */}
                  <div
                    className={`${getDotSize(point)} rounded-full cursor-pointer transition-all duration-200 hover:scale-150 hover:z-10`}
                    style={getDotColor(point)}
                  />

                  {/* 悬浮提示 */}
                  {hoveredId === point.id && entry && (
                    <div
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 rounded-lg p-2.5 min-w-[140px] z-20 pointer-events-none"
                      style={{ background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-medium)', border: 'var(--border-light)' }}
                    >
                      <div className="text-xs font-bold mb-1" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}>{entry.name}</div>
                      <div className="flex gap-2 text-[10px]">
                        <span style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-body)' }}>专注: {entry.engagement}</span>
                        <span style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-body)' }}>能量: {entry.energy}</span>
                      </div>
                      <div
                        className="inline-block mt-1 text-[9px] px-1.5 py-0.5 rounded"
                        style={{ background: 'var(--color-bg-elevated)', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}
                      >
                        {CATEGORY_LABELS[entry.category] || entry.category}
                      </div>
                      {point.isFlow && (
                        <div className="mt-1 text-[9px] font-medium" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-body)' }}>处于心流状态!</div>
                      )}
                      {/* 小三角 */}
                      <div
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 transform rotate-45"
                        style={{ background: 'var(--color-bg-card)', borderRight: 'var(--border-light)', borderBottom: 'var(--border-light)' }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 图例和统计 */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          {/* 图例 */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full shadow-sm" style={{ background: 'var(--color-primary)' }} />
              <span className="text-[10px]" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>心流</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full shadow-sm" style={{ background: 'var(--color-accent)' }} />
              <span className="text-[10px]" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>高专注</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full shadow-sm" style={{ background: 'var(--color-secondary)' }} />
              <span className="text-[10px]" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>高能量</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full shadow-sm" style={{ background: 'var(--color-text-muted)' }} />
              <span className="text-[10px]" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>待提升</span>
            </div>
          </div>

          {/* 统计 */}
          <div className="flex gap-2 text-[10px]">
            {stats.total > 0 && (
              <>
                <span
                  className="px-2 py-0.5 rounded-full font-medium"
                  style={{ color: 'var(--color-primary)', background: 'var(--color-bg-elevated)', fontFamily: 'var(--font-body)' }}
                >
                  心流 {stats.flow} ({Math.round(stats.flow / stats.total * 100)}%)
                </span>
                <span
                  className="px-2 py-0.5 rounded-full"
                  style={{ color: 'var(--color-text-muted)', background: 'var(--color-bg-elevated)', fontFamily: 'var(--font-body)' }}
                >
                  共 {stats.total} 项
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalEnergyMap;
