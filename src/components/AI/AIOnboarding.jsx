import React, { useState, useEffect } from 'react';
import { Sparkles, ChevronRight, Heart, BookOpen, Compass, Map, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { loadData, saveData } from '../../utils/storage';
import { isAIConfigured } from '../../services/ai';
import { getCardStyle, getButtonStyle } from '../../styles/components';

const ONBOARDING_KEY = 'ai-onboarding-done';

const steps = [
  {
    icon: Heart,
    title: '欢迎来到人生设计课',
    content: '你好！我是你的人生设计教练，基于斯坦福大学的设计思维方法论。我会帮你探索人生的可能性。',
    action: null,
  },
  {
    icon: BookOpen,
    title: '记录你的高光时刻',
    content: '先从"好时光日志"开始——记录那些让你感到充满能量和专注的活动。这是发现心流的关键。',
    action: { label: '开始记录', path: '/journal' },
  },
  {
    icon: Compass,
    title: '找到你的指南针',
    content: '写下你的工作观和生命观，看看它们是否一致。这是人生方向的基础。',
    action: { label: '写指南针', path: '/compass' },
  },
  {
    icon: Map,
    title: '设计三种人生',
    content: '奥德赛计划让你设计三个完全不同的人生版本。不要限制想象力！',
    action: { label: '设计计划', path: '/odyssey' },
  },
  {
    icon: Lightbulb,
    title: '开始探索吧',
    content: '记住：人生设计不是一次完成的，而是一个持续的过程。我随时在这里帮助你。',
    action: null,
  },
];

const AIOnboarding = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const done = loadData(ONBOARDING_KEY, false);
    if (!done) {
      // 延迟显示，让页面先加载
      const timer = setTimeout(() => setShow(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleClose();
    }
  };

  const handleAction = () => {
    const action = steps[step].action;
    if (action) {
      navigate(action.path);
    }
    handleClose();
  };

  const handleClose = () => {
    setShow(false);
    saveData(ONBOARDING_KEY, true);
  };

  if (!show) return null;

  const currentStep = steps[step];
  const Icon = currentStep.icon;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'rgba(74, 55, 40, 0.6)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="rounded-2xl p-8 max-w-md w-full mx-4 text-center"
        style={{ ...getCardStyle(true), boxShadow: '0 20px 60px rgba(74,55,40,0.3)' }}
      >
        {/* 图标 */}
        <div
          className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
            boxShadow: '0 8px 24px rgba(198,123,92,0.3)',
          }}
        >
          <Icon size={36} className="text-white" />
        </div>

        {/* 标题 */}
        <h2
          className="text-2xl font-bold mb-3"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
        >
          {currentStep.title}
        </h2>

        {/* 内容 */}
        <p
          className="text-sm leading-relaxed mb-8"
          style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}
        >
          {currentStep.content}
        </p>

        {/* 进度点 */}
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full transition-all"
              style={{
                background: i === step ? 'var(--color-primary)' : 'var(--color-bg-elevated)',
                width: i === step ? '24px' : '8px',
              }}
            />
          ))}
        </div>

        {/* 按钮 */}
        <div className="flex gap-3 justify-center">
          {currentStep.action && (
            <button
              onClick={handleAction}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer"
              style={getButtonStyle('secondary')}
            >
              {currentStep.action.label}
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer"
            style={getButtonStyle('primary')}
          >
            {step < steps.length - 1 ? (
              <>下一步 <ChevronRight size={16} /></>
            ) : (
              '开始探索'
            )}
          </button>
        </div>

        {/* 跳过 */}
        <button
          onClick={handleClose}
          className="mt-4 text-xs cursor-pointer"
          style={{ color: 'var(--color-text-muted)' }}
        >
          跳过引导
        </button>
      </div>
    </div>
  );
};

export default AIOnboarding;
