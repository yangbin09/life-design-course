import React from 'react';
import { Clock, DollarSign, Users, Wrench, BookOpen, AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react';
import { getCardStyle, getTitleStyle, getDescStyle } from '../../styles/components';

const resourceConfig = [
  { key: 'time', label: '时间', icon: Clock, desc: '每周可投入的小时数', color: 'blue' },
  { key: 'money', label: '金钱', icon: DollarSign, desc: '可支配的资金预算', color: 'green' },
  { key: 'connections', label: '人脉', icon: Users, desc: '相关的社交关系网络', color: 'purple' },
  { key: 'skills', label: '技能', icon: Wrench, desc: '已掌握的相关技能', color: 'orange' },
  { key: 'knowledge', label: '知识', icon: BookOpen, desc: '相关领域的知识储备', color: 'teal' }
];

const colorClasses = {
  blue: { bar: 'var(--color-primary)', bg: 'var(--color-bg-elevated)', text: 'var(--color-primary)', light: 'var(--color-bg-elevated)' },
  green: { bar: 'var(--color-primary)', bg: 'var(--color-bg-elevated)', text: 'var(--color-primary)', light: 'var(--color-bg-elevated)' },
  purple: { bar: 'var(--color-accent)', bg: 'var(--color-bg-elevated)', text: 'var(--color-accent)', light: 'var(--color-bg-elevated)' },
  orange: { bar: 'var(--color-accent)', bg: 'var(--color-bg-elevated)', text: 'var(--color-accent)', light: 'var(--color-bg-elevated)' },
  teal: { bar: 'var(--color-primary)', bg: 'var(--color-bg-elevated)', text: 'var(--color-primary)', light: 'var(--color-bg-elevated)' }
};

const getBarWidthClass = (value) => {
  if (value <= 10) return 'w-[10%]';
  if (value <= 20) return 'w-[20%]';
  if (value <= 30) return 'w-[30%]';
  if (value <= 40) return 'w-[40%]';
  if (value <= 50) return 'w-[50%]';
  if (value <= 60) return 'w-[60%]';
  if (value <= 70) return 'w-[70%]';
  if (value <= 80) return 'w-[80%]';
  if (value <= 90) return 'w-[90%]';
  return 'w-full';
};

const getLevelLabel = (value) => {
  if (value < 20) return { text: '严重不足', color: 'var(--color-error)', bg: 'var(--color-bg-elevated)' };
  if (value < 40) return { text: '较为欠缺', color: 'var(--color-accent)', bg: 'var(--color-bg-elevated)' };
  if (value < 60) return { text: '基本具备', color: 'var(--color-secondary)', bg: 'var(--color-bg-elevated)' };
  if (value < 80) return { text: '较为充足', color: 'var(--color-primary)', bg: 'var(--color-bg-elevated)' };
  return { text: '非常充足', color: 'var(--color-primary)', bg: 'var(--color-bg-elevated)' };
};

const OdysseyResources = ({ plan, colors, onUpdateResources, gapReport }) => {
  if (!plan) return null;

  const resources = plan.resources || { time: 50, money: 50, connections: 50, skills: 50 };
  const overallScore = Object.values(resources).reduce((a, b) => a + b, 0) / Object.keys(resources).length;
  const cardStyle = getCardStyle();
  const titleStyle = getTitleStyle('lg');
  const descStyle = getDescStyle();

  return (
    <div className="space-y-6">
      {/* 总览 */}
      <div className={`${colors.bg} rounded-xl p-6 border ${colors.border}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 style={{ ...titleStyle, marginBottom: '0.25rem' }}>资源盘点</h4>
            <p style={descStyle}>评估你执行这个计划所需资源的准备情况</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>{Math.round(overallScore)}</div>
              <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>综合得分</div>
            </div>
            <div className={`w-px h-10 ${colors.border}`}></div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>
                {Object.values(resources).filter(v => v >= 60).length}/{Object.keys(resources).length}
              </div>
              <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>达标项</div>
            </div>
          </div>
        </div>
      </div>

      {/* 资源项 */}
      <div className="space-y-4">
        {resourceConfig.map((res) => {
          const Icon = res.icon;
          const value = resources[res.key] || 0;
          const level = getLevelLabel(value);
          const resColors = colorClasses[res.color];

          return (
            <div key={res.key} style={cardStyle} className="p-5 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* 左侧图标和标签 */}
                <div className="flex items-center gap-3 sm:w-48 shrink-0">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: resColors.light }}>
                    <Icon size={20} style={{ color: resColors.text }} />
                  </div>
                  <div>
                    <div className="font-bold" style={{ color: 'var(--color-text)' }}>{res.label}</div>
                    <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{res.desc}</div>
                  </div>
                </div>

                {/* 中间滑块 */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: level.color, backgroundColor: level.bg }}>
                      {level.text}
                    </span>
                    <span className="text-sm font-mono font-bold" style={{ color: 'var(--color-text-secondary)' }}>{value}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={value}
                    onChange={(e) => onUpdateResources(res.key, parseInt(e.target.value))}
                    className="w-full h-2.5 rounded-lg appearance-none cursor-pointer"
                    style={{ backgroundColor: 'var(--color-bg-elevated)' }}
                  />
                  {/* 进度条可视化 */}
                  <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-bg-elevated)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${value}%`, backgroundColor: resColors.bar }}
                    ></div>
                  </div>
                </div>

                {/* 右侧达标指示 */}
                <div className="sm:w-20 text-center shrink-0">
                  {value >= 60 ? (
                    <CheckCircle size={24} style={{ color: 'var(--color-primary)' }} className="mx-auto" />
                  ) : (
                    <AlertTriangle size={24} style={{ color: 'var(--color-accent)' }} className="mx-auto" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 资源缺口报告 */}
      {gapReport && gapReport.gaps.length > 0 && (
        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--color-bg)', border: 'var(--border-warm)' }}>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={20} style={{ color: 'var(--color-accent)' }} />
            <h5 style={{ ...titleStyle, fontSize: '1rem', marginBottom: 0 }}>资源缺口报告</h5>
          </div>
          <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            以下资源低于安全阈值 (40%)，建议在行动前补齐或制定补充计划：
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {gapReport.gaps.map((gap) => {
              const res = resourceConfig.find(r => r.key === gap.resource);
              const Icon = res?.icon || AlertTriangle;
              return (
                <div key={gap.resource} className="rounded-lg p-4" style={{ backgroundColor: 'var(--color-bg-card)', border: 'var(--border-warm)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={16} style={{ color: 'var(--color-accent)' }} />
                    <span className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>{res?.label || gap.resource}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-bg-elevated)' }}>
                      <div className="h-full rounded-full" style={{ width: `${gap.current}%`, backgroundColor: 'var(--color-accent)' }}></div>
                    </div>
                    <span className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>{gap.current}%</span>
                    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>/</span>
                    <span className="text-xs font-mono" style={{ color: 'var(--color-primary)' }}>{gap.needed}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 资源充足时的提示 */}
      {gapReport && gapReport.gaps.length === 0 && (
        <div className="rounded-xl p-6 flex items-center gap-3" style={{ backgroundColor: 'var(--color-bg-elevated)', border: 'var(--border-warm)' }}>
          <TrendingUp size={20} style={{ color: 'var(--color-primary)' }} className="shrink-0" />
          <div>
            <p className="font-bold" style={{ color: 'var(--color-text)' }}>资源准备充足</p>
            <p className="text-sm" style={{ color: 'var(--color-primary)' }}>所有资源维度均达到安全阈值，可以开始执行计划。</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OdysseyResources;
