import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, TrendingUp, Lightbulb, ArrowRight, RefreshCw, Loader2 } from 'lucide-react';
import { useAIContext } from '../../contexts/AIContext';
import useAI from '../../hooks/useAI';
import { loadData, saveData } from '../../utils/storage';
import { getCardStyle } from '../../styles/components';

const INSIGHTS_KEY = 'ai-insights-cache';

/**
 * AI 主动洞察面板 - 基于用户数据自动生成建议
 */
const AIInsights = () => {
  const { userData, buildUserSummary } = useAIContext();
  const { loading, generateWithTemplate } = useAI();
  const [insights, setInsights] = useState(() => loadData(INSIGHTS_KEY, null));
  const [expanded, setExpanded] = useState(false);
  const [detailText, setDetailText] = useState('');
  const [detailLoading, setDetailLoading] = useState(false);

  // 检查是否需要刷新洞察（每天最多一次）
  const needsRefresh = useMemo(() => {
    if (!insights) return true;
    const lastUpdate = insights.timestamp || 0;
    const oneDay = 24 * 60 * 60 * 1000;
    return Date.now() - lastUpdate > oneDay;
  }, [insights]);

  // 自动生成洞察
  const generateInsights = async () => {
    try {
      const prompt = `基于以下用户数据，生成 3 条简短的人生设计洞察建议。每条不超过 30 字。
要求：结合具体数据，给出可执行的建议。不要用编号，用换行分隔。

用户数据：
${buildUserSummary}

输出格式（严格遵守）：
洞察1内容
洞察2内容
洞察3内容`;

      const result = await generateWithTemplate(prompt);
      const lines = result.split('\n').filter(l => l.trim()).slice(0, 3);
      const newInsights = {
        items: lines.map(l => l.replace(/^\d+[.、)\]]\s*/, '').trim()),
        timestamp: Date.now(),
      };
      setInsights(newInsights);
      saveData(INSIGHTS_KEY, newInsights);
    } catch (err) {
      console.error('生成洞察失败:', err);
    }
  };

  // 查看详细分析
  const handleDetail = async (insight) => {
    setDetailLoading(true);
    setExpanded(true);
    try {
      const result = await generateWithTemplate(
        `用户数据：${buildUserSummary}\n\n针对这个洞察展开分析，给出 3-5 个具体行动步骤。不超过 200 字。\n洞察：${insight}`
      );
      setDetailText(result);
    } catch (err) {
      setDetailText('生成失败，请重试');
    } finally {
      setDetailLoading(false);
    }
  };

  // 首次加载自动生成
  useEffect(() => {
    if (needsRefresh && !loading) {
      generateInsights();
    }
  }, []); // eslint-disable-line

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        ...getCardStyle(),
        background: 'linear-gradient(135deg, rgba(198,123,92,0.06), rgba(181,101,29,0.06))',
        border: '1px solid rgba(198,123,92,0.15)',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' }}
          >
            <Sparkles size={16} className="text-white" />
          </div>
          <h3
            className="text-base font-bold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
          >
            AI 洞察
          </h3>
        </div>
        <button
          onClick={generateInsights}
          disabled={loading}
          className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors cursor-pointer"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          刷新
        </button>
      </div>

      {loading && !insights ? (
        <div className="flex items-center gap-2 py-4" style={{ color: 'var(--color-text-muted)' }}>
          <Loader2 size={16} className="animate-spin" />
          <span className="text-sm">正在分析你的数据...</span>
        </div>
      ) : insights?.items ? (
        <div className="space-y-2">
          {insights.items.map((item, i) => (
            <div key={i}>
              <button
                onClick={() => handleDetail(item)}
                className="w-full text-left flex items-start gap-2 p-2.5 rounded-xl transition-all cursor-pointer"
                style={{
                  background: 'var(--color-bg-card)',
                  border: 'var(--border-light)',
                }}
              >
                <Lightbulb size={14} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--color-accent)' }} />
                <span className="text-sm flex-1" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}>
                  {item}
                </span>
                <ArrowRight size={14} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--color-text-muted)' }} />
              </button>
            </div>
          ))}

          {/* 展开的详细分析 */}
          {expanded && (
            <div
              className="mt-3 p-4 rounded-xl text-sm leading-relaxed"
              style={{
                background: 'var(--color-bg-elevated)',
                border: 'var(--border-light)',
                color: 'var(--color-text)',
                fontFamily: 'var(--font-body)',
              }}
            >
              {detailLoading ? (
                <div className="flex items-center gap-2" style={{ color: 'var(--color-text-muted)' }}>
                  <Loader2 size={14} className="animate-spin" />
                  正在分析...
                </div>
              ) : (
                <>
                  {detailText}
                  <button
                    onClick={() => setExpanded(false)}
                    className="block mt-2 text-xs cursor-pointer"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    收起
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm py-2" style={{ color: 'var(--color-text-muted)' }}>
          开始使用各模块后，AI 会为你生成个性化洞察
        </p>
      )}
    </div>
  );
};

export default AIInsights;
