import React from 'react';
import { MapPin, CheckCircle, Circle, Lock } from 'lucide-react';
import { getCardStyle, getTitleStyle, getDescStyle } from '../../styles/components';

const MODULE_COLORS = {
  dashboard: { bg: 'var(--color-bg-elevated)', border: 'var(--border-warm)', text: 'var(--color-primary)', dot: 'var(--color-primary)' },
  compass: { bg: 'var(--color-bg-elevated)', border: 'var(--border-warm)', text: 'var(--color-primary)', dot: 'var(--color-primary)' },
  odyssey: { bg: 'var(--color-bg-elevated)', border: 'var(--border-warm)', text: 'var(--color-accent)', dot: 'var(--color-accent)' },
  prototype: { bg: 'var(--color-bg-elevated)', border: 'var(--border-light)', text: 'var(--color-text-secondary)', dot: 'var(--color-text-secondary)' },
  'design-thinking': { bg: 'var(--color-bg-elevated)', border: 'var(--border-warm)', text: 'var(--color-accent)', dot: 'var(--color-accent)' },
};

const MODULE_LABELS = {
  dashboard: '仪表盘',
  compass: '指南针',
  odyssey: '奥德赛',
  prototype: '原型设计',
  'design-thinking': '设计思维',
};

const JourneyMap = ({ milestones, completedMilestones, onToggle, progress }) => {
  const cardStyle = getCardStyle();
  const titleStyle = getTitleStyle('lg');
  const descStyle = getDescStyle();

  return (
    <div className="space-y-6">
      {/* 进度概览 */}
      <div style={cardStyle} className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-elevated)' }}>
              <MapPin style={{ color: 'var(--color-primary)' }} size={20} />
            </div>
            <div>
              <h4 style={{ ...titleStyle, marginBottom: 0 }}>旅程进度</h4>
              <p style={{ ...descStyle, fontSize: '0.75rem' }}>完成所有里程碑，完成你的人生设计之旅</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>{progress.percentage}%</div>
            <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{progress.completed}/{progress.total}</div>
          </div>
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-bg-elevated)' }}>
          <div
            className="h-full transition-all duration-500 rounded-full"
            style={{ width: `${progress.percentage}%`, background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))' }}
          />
        </div>
      </div>

      {/* 旅程路线 */}
      <div className="relative">
        {/* 连接线 */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5" style={{ backgroundColor: 'var(--border-light)' }} />

        <div className="space-y-4">
          {milestones.map((milestone, idx) => {
            const isCompleted = completedMilestones.includes(milestone.id);
            const colors = MODULE_COLORS[milestone.module];
            const isFirst = idx === 0;
            const prevCompleted = idx === 0 || completedMilestones.includes(milestones[idx - 1].id);

            return (
              <div key={milestone.id} className="relative flex items-start gap-4 pl-2">
                {/* 节点 */}
                <button
                  onClick={() => onToggle(milestone.id)}
                  className="relative z-10 w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all flex-shrink-0"
                  style={isCompleted
                    ? { backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-primary)', color: 'white', boxShadow: 'var(--shadow-medium)' }
                    : prevCompleted
                    ? { backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }
                    : { backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--border-light)', color: 'var(--color-text-muted)' }}
                >
                  {isCompleted ? <CheckCircle size={18} /> : <Circle size={18} />}
                </button>

                {/* 内容卡 */}
                <div
                  className="flex-1 rounded-xl p-4 transition-all cursor-pointer"
                  style={isCompleted
                    ? { backgroundColor: 'var(--color-bg)', border: 'var(--border-warm)' }
                    : prevCompleted
                    ? { backgroundColor: 'var(--color-bg-card)', border: 'var(--border-light)' }
                    : { backgroundColor: 'var(--color-bg-elevated)', border: 'var(--border-light)', opacity: 0.6 }}
                  onClick={() => onToggle(milestone.id)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.bg, color: colors.text }}>
                      {MODULE_LABELS[milestone.module]}
                    </span>
                    <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>步骤 {idx + 1}</span>
                  </div>
                  <h5 className="font-bold text-sm" style={{ color: isCompleted ? 'var(--color-primary)' : 'var(--color-text)' }}>
                    {milestone.title}
                  </h5>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{milestone.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default JourneyMap;
