import React, { useMemo } from 'react';
import { AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Lightbulb, Shield, Zap, Heart } from 'lucide-react';
import { getCardStyle, getTitleStyle } from '../../styles/components';

const dimensionNames = {
  health: { name: '健康', icon: Shield, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  work: { name: '工作', icon: Zap, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  play: { name: '娱乐', icon: Heart, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
  love: { name: '爱', icon: Heart, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' }
};

// 能量等级定义
const energyLevels = [
  { min: 0, max: 20, label: '严重不足', color: 'text-red-700', bg: 'bg-red-100', emoji: '警告' },
  { min: 21, max: 40, label: '偏低', color: 'text-orange-700', bg: 'bg-orange-100', emoji: '注意' },
  { min: 41, max: 60, label: '正常', color: 'text-yellow-700', bg: 'bg-yellow-100', emoji: '平稳' },
  { min: 61, max: 80, label: '良好', color: 'text-green-700', bg: 'bg-green-100', emoji: '健康' },
  { min: 81, max: 100, label: '充沛', color: 'text-emerald-700', bg: 'bg-emerald-100', emoji: '优秀' }
];

const getLevel = (value) => energyLevels.find(l => value >= l.min && value <= l.max) || energyLevels[2];

/**
 * 仪表盘智能诊断报告组件
 * 根据四维度数据生成人生能量诊断书，识别失衡模式
 */
const DashboardDiagnosis = ({ data, diagnosis, history = [] }) => {
  // 计算总体能量值
  const totalEnergy = useMemo(() => {
    const values = Object.values(data);
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  }, [data]);

  // 计算各维度详情
  const dimensionDetails = useMemo(() => {
    return Object.entries(data).map(([key, value]) => {
      const meta = dimensionNames[key];
      const level = getLevel(value);

      // 查看趋势（如果有历史数据）
      let trend = 'stable';
      if (history.length >= 2) {
        const lastTwo = history.slice(-2);
        const prevVal = lastTwo[0]?.data?.[key];
        if (prevVal !== undefined) {
          if (value - prevVal > 5) trend = 'up';
          else if (prevVal - value > 5) trend = 'down';
        }
      }

      return { key, value, ...meta, level, trend };
    });
  }, [data, history]);

  // 生成失衡模式分析
  const imbalancePatterns = useMemo(() => {
    const patterns = [];
    const values = Object.entries(data);
    const avg = totalEnergy;

    // 模式1：极端失衡（某项特别低）
    values.forEach(([key, val]) => {
      if (val < 25) {
        patterns.push({
          type: 'critical',
          title: `${dimensionNames[key].name}能量严重不足`,
          description: `${dimensionNames[key].name}维度仅 ${val}%，已处于危险区域。这可能影响你整体的生活质量。`,
          action: `建议立即关注${dimensionNames[key].name}领域，从小的改变开始。`
        });
      }
    });

    // 模式2：工作-娱乐失衡
    if (data.work > 75 && data.play < 35) {
      patterns.push({
        type: 'warning',
        title: '工作-娱乐失衡',
        description: `工作能量 ${data.work}% 但娱乐仅 ${data.play}%，你可能过度投入工作而忽略了休息。`,
        action: '建议每天安排至少30分钟的纯粹娱乐时间，这不是浪费，而是充电。'
      });
    }

    // 模式3：健康-其他失衡
    if (data.health < 40 && (data.work > 60 || data.play > 60)) {
      patterns.push({
        type: 'warning',
        title: '健康支撑不足',
        description: '健康能量较低，但其他维度较高。没有好的身体，其他成就都难以持续。',
        action: '建议优先改善睡眠和运动习惯，这会自然提升其他维度。'
      });
    }

    // 模式4：社交孤立（爱+娱乐都低）
    if (data.love < 35 && data.play < 35) {
      patterns.push({
        type: 'info',
        title: '社交连接薄弱',
        description: '爱和娱乐维度都偏低，可能意味着社交生活需要更多关注。',
        action: '建议主动联系一位老朋友，或参加一个新的社交活动。'
      });
    }

    // 模式5：全面优秀
    if (values.every(([_, v]) => v >= 60)) {
      patterns.push({
        type: 'success',
        title: '人生状态良好',
        description: '四维度都在健康范围内，你正在维持一个平衡的生活方式。',
        action: '继续保持！可以思考如何在某个维度实现突破。'
      });
    }

    // 模式6：全面低迷
    if (values.every(([_, v]) => v < 40)) {
      patterns.push({
        type: 'critical',
        title: '整体能量偏低',
        description: '四个维度都在低位，可能正处于人生低谷期。',
        action: '不要试图同时改变所有事情。选择最容易的一个小步骤开始。'
      });
    }

    return patterns;
  }, [data, totalEnergy]);

  // 生成建议列表
  const suggestions = useMemo(() => {
    const result = [];

    // 基于诊断的建议
    if (diagnosis?.suggestions) {
      result.push(...diagnosis.suggestions.map(s => ({ text: s, source: 'diagnosis' })));
    }

    // 基于模式的建议
    imbalancePatterns.forEach(p => {
      if (p.action) {
        result.push({ text: p.action, source: 'pattern' });
      }
    });

    // 去重
    const seen = new Set();
    return result.filter(s => {
      if (seen.has(s.text)) return false;
      seen.add(s.text);
      return true;
    });
  }, [diagnosis, imbalancePatterns]);

  const totalLevel = getLevel(totalEnergy);

  return (
    <div className="space-y-5">
      {/* 总体能量卡 */}
      <div className="rounded-xl p-5" style={{ ...getCardStyle(true), borderLeft: '4px solid var(--color-primary)' }}>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>人生能量总览</h4>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${totalLevel.bg} ${totalLevel.color}`}>
            {totalLevel.label}
          </span>
        </div>

        {/* 环形进度 */}
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 flex-shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="var(--border-light)"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={totalEnergy >= 60 ? '#22c55e' : totalEnergy >= 40 ? '#f59e0b' : '#ef4444'}
                strokeWidth="3"
                strokeDasharray={`${totalEnergy}, 100`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>{totalEnergy}</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              {totalEnergy >= 70
                ? '你的人生能量充沛，正在高效运转。'
                : totalEnergy >= 50
                ? '能量处于中等水平，有些领域需要充电。'
                : '能量偏低，需要认真关注生活中的能量消耗。'}
            </p>
          </div>
        </div>
      </div>

      {/* 各维度详情 */}
      <div className="grid grid-cols-2 gap-2">
        {dimensionDetails.map(dim => {
          const IconComp = dim.icon;
          return (
            <div
              key={dim.key}
              className={`${dim.bg} ${dim.border} border rounded-lg p-3 transition-all hover:shadow-sm`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <IconComp size={14} className={dim.color} />
                  <span className="text-xs font-bold" style={{ color: 'var(--color-text)' }}>{dim.name}</span>
                </div>
                {dim.trend === 'up' && <TrendingUp size={12} className="text-green-500" />}
                {dim.trend === 'down' && <TrendingDown size={12} className="text-red-500" />}
              </div>
              <div className="flex items-end gap-1">
                <span className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>{dim.value}</span>
                <span className="text-[10px] mb-0.5" style={{ color: 'var(--color-text-muted)' }}>%</span>
              </div>
              <span className={`text-[10px] font-bold ${dim.level.color}`}>
                {dim.level.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* 失衡模式检测 */}
      {imbalancePatterns.length > 0 && (
        <div>
          <h4 className="text-sm font-bold mb-2 flex items-center gap-1.5" style={{ color: 'var(--color-text)' }}>
            <AlertTriangle size={14} className="text-amber-500" />
            模式检测
          </h4>
          <div className="space-y-2">
            {imbalancePatterns.map((pattern, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border text-sm ${
                  pattern.type === 'critical'
                    ? 'bg-red-50 border-red-200'
                    : pattern.type === 'warning'
                    ? 'bg-amber-50 border-amber-200'
                    : pattern.type === 'success'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start gap-2">
                  {pattern.type === 'critical' ? (
                    <AlertTriangle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                  ) : pattern.type === 'success' ? (
                    <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <Lightbulb size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-bold text-xs mb-0.5" style={{ color: 'var(--color-text)' }}>{pattern.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{pattern.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 建议列表 */}
      {suggestions.length > 0 && (
        <div>
          <h4 className="text-sm font-bold mb-2 flex items-center gap-1.5" style={{ color: 'var(--color-text)' }}>
            <Lightbulb size={14} className="text-yellow-500" />
            行动建议
          </h4>
          <ul className="space-y-1.5">
            {suggestions.map((s, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'var(--color-primary)' }} />
                <span>{s.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 底部提示 */}
      <div className="rounded-lg p-3" style={getCardStyle(true)}>
        <p className="text-[11px] leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
          此诊断基于你当前的自评数据生成，仅供参考。设计思维鼓励你通过实际行动去验证和改善。
        </p>
      </div>
    </div>
  );
};

export default DashboardDiagnosis;
