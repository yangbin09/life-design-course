import React, { useState, useMemo } from 'react';
import { Users, User, ArrowLeftRight, ChevronDown, ChevronUp, Save, RotateCcw, Clock } from 'lucide-react';
import DashboardSlider from './DashboardSlider';
import { getBarColor } from './DashboardSlider';
import { getCardStyle, getButtonStyle, getTitleStyle } from '../../styles/components';

/**
 * 对比条形图 - 并排显示自评和他评数据
 */
const CompareBar = ({ selfValue, otherValue, label }) => {
  const diff = otherValue - selfValue;
  const maxVal = Math.max(selfValue, otherValue, 1);

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-xs">
        <span className="font-bold" style={{ color: 'var(--color-text)' }}>{label}</span>
        <span className={`font-mono font-bold text-[10px] ${
          diff > 10 ? 'text-green-600' : diff < -10 ? 'text-red-600' : ''
        }`} style={diff <= 10 && diff >= -10 ? { color: 'var(--color-text-secondary)' } : undefined}>
          {diff > 0 ? '+' : ''}{diff}
        </span>
      </div>

      {/* 自评 */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] w-5 text-right" style={{ color: 'var(--color-text-muted)' }}>自</span>
        <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: 'var(--color-bg-elevated)' }}>
          <div
            className={`h-full rounded-full transition-all duration-500 ${getBarColor(selfValue)}`}
            style={{ width: `${selfValue}%` }}
          />
        </div>
        <span className="text-[10px] font-mono w-7" style={{ color: 'var(--color-text-secondary)' }}>{selfValue}%</span>
      </div>

      {/* 他评 */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] w-5 text-right" style={{ color: 'var(--color-text-muted)' }}>他</span>
        <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: 'var(--color-bg-elevated)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${otherValue}%`, background: 'var(--color-primary)' }}
          />
        </div>
        <span className="text-[10px] font-mono w-7" style={{ color: 'var(--color-text-secondary)' }}>{otherValue}%</span>
      </div>
    </div>
  );
};

/**
 * 仪表盘对比功能组件
 * 支持自评和他评两种模式，对比认知差异
 */
const DashboardCompare = ({
  selfData,
  compareHook
}) => {
  const {
    compareMode,
    setCompareMode,
    otherData,
    updateOtherDimension,
    evaluatorName,
    setEvaluatorName,
    compareHistory,
    getDifferences,
    getCompareAnalysis,
    saveCompareRecord,
    resetOtherData
  } = compareHook;

  const [showHistory, setShowHistory] = useState(false);
  const [saved, setSaved] = useState(false);

  const differences = useMemo(() => getDifferences(selfData), [getDifferences, selfData]);
  const analysis = useMemo(() => getCompareAnalysis(selfData), [getCompareAnalysis, selfData]);

  const handleSave = () => {
    saveCompareRecord(selfData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    resetOtherData();
    setSaved(false);
  };

  return (
    <div className="space-y-5">
      {/* 模式切换 */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold flex items-center gap-1.5" style={{ color: 'var(--color-text)' }}>
          <ArrowLeftRight size={14} style={{ color: 'var(--color-primary)' }} />
          认知对比
        </h4>
        <div className="flex gap-1 rounded-lg p-0.5" style={{ background: 'var(--color-bg-elevated)' }}>
          <button
            onClick={() => setCompareMode('self')}
            className={`text-[10px] font-bold px-3 py-1.5 rounded-md transition-colors flex items-center gap-1 ${
              compareMode === 'self'
                ? 'shadow-sm'
                : ''
            }`}
            style={compareMode === 'self'
              ? { background: 'var(--color-bg-card)', color: 'var(--color-primary)' }
              : { color: 'var(--color-text-secondary)' }}
          >
            <User size={10} /> 自评视角
          </button>
          <button
            onClick={() => setCompareMode('other')}
            className={`text-[10px] font-bold px-3 py-1.5 rounded-md transition-colors flex items-center gap-1 ${
              compareMode === 'other'
                ? 'shadow-sm'
                : ''
            }`}
            style={compareMode === 'other'
              ? { background: 'var(--color-bg-card)', color: 'var(--color-primary)' }
              : { color: 'var(--color-text-secondary)' }}
          >
            <Users size={10} /> 他评视角
          </button>
        </div>
      </div>

      {/* 说明文字 */}
      <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
        <p className="text-[11px] text-blue-700 leading-relaxed">
          {compareMode === 'self'
            ? '邀请朋友或家人对你的四维度进行评估，对比自我认知与他人观察的差异。'
            : '请他评者根据对你的真实观察，诚实拖动滑块进行评估。'}
        </p>
      </div>

      {/* 他评者名称 */}
      <div className="flex items-center gap-2">
        <label className="text-xs font-bold whitespace-nowrap" style={{ color: 'var(--color-text-secondary)' }}>评估者：</label>
        <input
          type="text"
          value={evaluatorName}
          onChange={(e) => setEvaluatorName(e.target.value)}
          placeholder="输入名字（可选）"
          className="flex-1 text-sm rounded-lg px-3 py-1.5 focus:outline-none"
          style={{ border: '1px solid var(--border-light)' }}
        />
      </div>

      {/* 他评滑块 */}
      <div className="rounded-xl p-4" style={getCardStyle()}>
        <DashboardSlider
          data={otherData}
          onChange={updateOtherDimension}
          title={evaluatorName ? `${evaluatorName} 的评估` : '他评数据'}
        />
      </div>

      {/* 对比视图 */}
      <div>
        <h5 className="text-xs font-bold mb-3" style={{ color: 'var(--color-text)' }}>对比结果</h5>
        <div className="space-y-3">
          {differences.map(diff => (
            <CompareBar
              key={diff.key}
              selfValue={diff.selfValue}
              otherValue={diff.otherValue}
              label={diff.name}
            />
          ))}
        </div>
      </div>

      {/* 分析结果 */}
      <div className="rounded-xl p-4" style={{ ...getCardStyle(true), borderLeft: '4px solid var(--color-primary)' }}>
        <h5 className="text-xs font-bold mb-2" style={{ color: 'var(--color-text)' }}>对比分析</h5>
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--color-text)' }}>{analysis.summary}</p>
        {analysis.insights.length > 0 && (
          <ul className="space-y-1.5">
            {analysis.insights.map((insight, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                <span className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'var(--color-primary)' }} />
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-3 pt-2" style={{ borderTop: '1px solid var(--border-light)' }}>
          <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
            平均认知差异：{analysis.avgDiff} 分
          </span>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={saved}
          className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 rounded-lg transition-all ${
            saved
              ? ''
              : 'active:scale-[0.98]'
          }`}
          style={saved
            ? { background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0' }
            : { background: 'var(--color-primary)', color: 'white' }}
        >
          {saved ? (
            <>
              <Save size={12} /> 已保存
            </>
          ) : (
            <>
              <Save size={12} /> 保存对比记录
            </>
          )}
        </button>
        <button
          onClick={handleReset}
          className="flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 px-4 rounded-lg transition-colors"
          style={{ border: '1px solid var(--border-light)', color: 'var(--color-text-secondary)' }}
        >
          <RotateCcw size={12} /> 重置
        </button>
      </div>

      {/* 对比历史 */}
      {compareHistory.length > 0 && (
        <div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-1.5 text-xs font-bold transition-colors w-full"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <Clock size={12} />
            对比历史 ({compareHistory.length})
            {showHistory ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

          {showHistory && (
            <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
              {compareHistory.slice().reverse().map(record => (
                <div
                  key={record.id}
                  className="rounded-lg p-3 text-xs"
                  style={getCardStyle()}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold" style={{ color: 'var(--color-text)' }}>
                      {record.evaluatorName}
                    </span>
                    <span style={{ color: 'var(--color-text-muted)' }}>
                      {new Date(record.timestamp).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                  <p className="text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>
                    {record.analysis.summary}
                  </p>
                  <div className="flex gap-2 mt-1.5">
                    {record.differences.map(d => (
                      <span
                        key={d.key}
                        className={`text-[10px] font-mono ${
                          d.status === 'higher' ? 'text-green-600' :
                          d.status === 'lower' ? 'text-red-600' : ''
                        }`}
                        style={d.status !== 'higher' && d.status !== 'lower' ? { color: 'var(--color-text-muted)' } : undefined}
                      >
                        {d.name} {d.diff > 0 ? '+' : ''}{d.diff}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardCompare;
