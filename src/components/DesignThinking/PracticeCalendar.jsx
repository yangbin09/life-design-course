import React, { useState } from 'react';
import { Calendar, CheckCircle, Circle, ChevronDown, ChevronUp, Award } from 'lucide-react';
import { getCardStyle, getButtonStyle, getTitleStyle, getDescStyle } from '../../styles/components';

const PracticeCalendar = ({ practicePlan, categoryLabels, checkedDays, onToggleDay, progress, categoryProgress }) => {
  const [expandedDay, setExpandedDay] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');

  const filtered = filterCategory === 'all'
    ? practicePlan
    : practicePlan.filter(p => p.category === filterCategory);

  return (
    <div className="space-y-6">
      {/* 进度概览 */}
      <div className="p-6" style={getCardStyle()}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(181, 101, 29, 0.15)' }}>
              <Award size={20} style={{ color: 'var(--color-accent)' }} />
            </div>
            <div>
              <h4 className="font-bold" style={{ color: 'var(--color-text)' }}>30天设计思维挑战</h4>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>每天一个设计思维练习</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold" style={{ color: 'var(--color-accent)' }}>{progress.completed}/{progress.total}</div>
            <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>已完成</div>
          </div>
        </div>

        {/* 进度条 */}
        <div className="h-3 rounded-full overflow-hidden mb-4" style={{ background: 'var(--color-bg-elevated)' }}>
          <div
            className="h-full transition-all duration-500 rounded-full"
            style={{ background: 'linear-gradient(90deg, var(--color-accent), var(--color-primary))', width: `${progress.percentage}%` }}
          />
        </div>

        {/* 分类进度 */}
        <div className="grid grid-cols-5 gap-2">
          {categoryProgress.map(cat => (
            <div key={cat.key} className="text-center">
              <div className={`text-xs font-bold px-2 py-1 rounded-full ${cat.color}`}>
                {cat.label}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{cat.completed}/{cat.total}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 分类筛选 */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilterCategory('all')}
          className="text-xs px-3 py-1.5 rounded-full border transition-all"
          style={filterCategory === 'all'
            ? { background: 'var(--color-accent)', color: 'white', borderColor: 'var(--color-accent)' }
            : { background: 'var(--color-bg-card)', color: 'var(--color-text-secondary)', borderColor: 'var(--border-light)' }
          }
        >
          全部
        </button>
        {Object.entries(categoryLabels).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setFilterCategory(key)}
            className="text-xs px-3 py-1.5 rounded-full border transition-all"
            style={filterCategory === key
              ? { background: 'var(--color-accent)', color: 'white', borderColor: 'var(--color-accent)' }
              : { background: 'var(--color-bg-card)', color: 'var(--color-text-secondary)', borderColor: 'var(--border-light)' }
            }
          >
            {val.label}
          </button>
        ))}
      </div>

      {/* 日历列表 */}
      <div className="space-y-3">
        {filtered.map((practice) => {
          const isChecked = checkedDays.includes(practice.day);
          const isExpanded = expandedDay === practice.day;
          const catInfo = categoryLabels[practice.category];

          return (
            <div
              key={practice.day}
              className="rounded-xl border transition-all"
              style={{
                background: isChecked ? 'rgba(198, 123, 92, 0.06)' : 'var(--color-bg-card)',
                borderColor: isChecked ? 'rgba(198, 123, 92, 0.3)' : 'var(--border-light)'
              }}
            >
              <div
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                onClick={() => setExpandedDay(isExpanded ? null : practice.day)}
              >
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleDay(practice.day); }}
                  className="flex-shrink-0"
                >
                  {isChecked ? (
                    <CheckCircle size={24} style={{ color: 'var(--color-primary)' }} />
                  ) : (
                    <Circle size={24} style={{ color: 'var(--color-text-muted)' }} />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold" style={{ color: 'var(--color-text-muted)' }}>Day {practice.day}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${catInfo.color}`}>
                      {catInfo.label}
                    </span>
                  </div>
                  <h5 className="font-bold text-sm mt-0.5" style={{ color: isChecked ? 'var(--color-primary)' : 'var(--color-text)', textDecoration: isChecked ? 'line-through' : 'none' }}>
                    {practice.title}
                  </h5>
                </div>

                {isExpanded ? <ChevronUp size={16} style={{ color: 'var(--color-text-muted)' }} /> : <ChevronDown size={16} style={{ color: 'var(--color-text-muted)' }} />}
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 pt-0 ml-10">
                  <p className="text-sm leading-relaxed p-3 rounded-lg" style={{ color: 'var(--color-text-secondary)', background: 'var(--color-bg-elevated)' }}>
                    {practice.description}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PracticeCalendar;
