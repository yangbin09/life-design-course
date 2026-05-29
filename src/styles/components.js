/**
 * 统一样式工具 - 温暖自然风格
 * 所有组件都使用这些统一的样式类
 */

// 页面头部样式
export const pageHeader = {
  wrapper: 'rounded-2xl p-8 md:p-10 mb-8',
  background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
  icon: 'w-16 h-16 rounded-2xl flex items-center justify-center mb-4',
  iconBg: 'rgba(255, 255, 255, 0.2)',
  title: 'text-2xl md:text-3xl font-bold mb-2',
  titleFont: 'var(--font-heading)',
  titleColor: 'white',
  description: 'text-sm md:text-base max-w-lg mx-auto leading-relaxed',
  descColor: 'rgba(255, 255, 255, 0.85)',
};

// Tab 导航样式
export const tabNav = {
  wrapper: 'flex gap-2 mb-8',
  wrapperCenter: 'flex gap-2 mb-8 justify-center',
  item: 'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer',
  itemActive: 'bg-white text-amber-800 shadow-md',
  itemInactive: 'text-amber-700 hover:bg-white/50',
  itemFont: 'var(--font-body)',
};

// 卡片样式
export const card = {
  base: 'rounded-2xl p-6 transition-all duration-200',
  background: 'var(--color-bg-card)',
  border: 'var(--border-light)',
  shadow: 'var(--shadow-soft)',
  shadowHover: 'var(--shadow-medium)',
  title: 'text-lg font-bold mb-4 flex items-center gap-2',
  titleFont: 'var(--font-heading)',
  titleColor: 'var(--color-text)',
};

// 区域标题
export const sectionTitle = {
  wrapper: 'flex items-center gap-3 mb-6',
  line: 'h-1 w-12 rounded-full',
  lineBg: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary-light))',
  text: 'text-xl font-bold',
  textFont: 'var(--font-heading)',
  textColor: 'var(--color-text)',
};

// 按钮样式
export const button = {
  primary: 'px-5 py-2.5 rounded-xl font-medium transition-all duration-200',
  primaryBg: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
  primaryColor: 'white',
  primaryShadow: 'var(--shadow-warm)',
  primaryHover: 'transform: translateY(-1px); box-shadow: var(--shadow-large)',

  secondary: 'px-5 py-2.5 rounded-xl font-medium transition-all duration-200',
  secondaryBg: 'var(--color-bg-elevated)',
  secondaryColor: 'var(--color-text)',
  secondaryBorder: 'var(--border-warm)',

  cta: 'px-6 py-3 rounded-xl font-bold text-lg transition-all duration-200',
  ctaBg: 'linear-gradient(135deg, var(--color-cta), var(--color-cta-dark))',
  ctaColor: 'white',
  ctaShadow: 'var(--shadow-large)',
};

// 输入框样式
export const input = {
  base: 'w-full px-4 py-3 rounded-xl transition-all duration-200',
  background: 'var(--color-bg)',
  border: 'var(--border-warm)',
  font: 'var(--font-body)',
  textColor: 'var(--color-text)',
  placeholderColor: 'var(--color-text-muted)',
  focusBorder: 'var(--color-primary)',
  focusShadow: '0 0 0 3px rgba(198, 123, 92, 0.1)',
};

// 标签样式
export const badge = {
  base: 'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium',
  background: 'var(--color-bg-elevated)',
  border: 'var(--border-light)',
  color: 'var(--color-text-secondary)',
};

// 进度条样式
export const progressBar = {
  wrapper: 'w-full rounded-full overflow-hidden',
  wrapperBg: 'var(--color-bg-elevated)',
  wrapperBorder: 'var(--border-light)',
  wrapperHeight: '10px',
  fill: 'h-full rounded-full transition-all duration-500',
  fillBg: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary-light))',
};

// 提示框样式
export const tipBox = {
  base: 'p-4 rounded-xl',
  background: 'var(--color-bg-elevated)',
  borderLeft: '4px solid var(--color-primary)',
  icon: 'text-lg mr-2',
  text: 'text-sm',
  textColor: 'var(--color-text-secondary)',
};

// 空状态样式
export const emptyState = {
  wrapper: 'text-center py-12',
  icon: 'w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center',
  iconBg: 'var(--color-bg-elevated)',
  iconColor: 'var(--color-text-muted)',
  title: 'text-lg font-bold mb-2',
  titleFont: 'var(--font-heading)',
  titleColor: 'var(--color-text)',
  description: 'text-sm mb-4',
  descColor: 'var(--color-text-muted)',
};

// 表格样式
export const table = {
  wrapper: 'w-full rounded-2xl overflow-hidden',
  wrapperShadow: 'var(--shadow-soft)',
  header: 'px-6 py-4 text-left text-sm font-semibold',
  headerBg: 'var(--color-bg-elevated)',
  headerColor: 'var(--color-text-secondary)',
  headerFont: 'var(--font-body)',
  cell: 'px-6 py-4 text-sm',
  cellColor: 'var(--color-text)',
  cellBorder: 'var(--border-light)',
  rowHover: 'var(--color-bg)',
};

// 模态框样式
export const modal = {
  overlay: 'fixed inset-0 z-50 flex items-center justify-center',
  overlayBg: 'rgba(74, 55, 40, 0.5)',
  backdrop: 'backdrop-blur-sm',
  content: 'rounded-2xl p-6 max-w-md w-full mx-4',
  contentBg: 'var(--color-bg-card)',
  contentShadow: 'var(--shadow-large)',
  contentBorder: 'var(--border-light)',
  title: 'text-xl font-bold mb-4',
  titleFont: 'var(--font-heading)',
  titleColor: 'var(--color-text)',
};

// 工具函数：生成统一样式
export const createStyles = (baseStyle, customStyle = {}) => ({
  ...baseStyle,
  ...customStyle,
});

// 工具函数：生成卡片样式
export const getCardStyle = (elevated = false) => ({
  background: elevated ? 'var(--color-bg-elevated)' : 'var(--color-bg-card)',
  border: 'var(--border-light)',
  borderRadius: 'var(--radius-xl)',
  boxShadow: elevated ? 'var(--shadow-medium)' : 'var(--shadow-soft)',
});

// 工具函数：生成按钮样式
export const getButtonStyle = (variant = 'primary') => {
  const styles = {
    primary: {
      background: button.primaryBg,
      color: button.primaryColor,
      boxShadow: button.primaryShadow,
      borderRadius: 'var(--radius-md)',
      fontFamily: 'var(--font-body)',
      fontWeight: '600',
    },
    secondary: {
      background: button.secondaryBg,
      color: button.secondaryColor,
      border: button.secondaryBorder,
      borderRadius: 'var(--radius-md)',
      fontFamily: 'var(--font-body)',
      fontWeight: '600',
    },
    cta: {
      background: button.ctaBg,
      color: button.ctaColor,
      boxShadow: button.ctaShadow,
      borderRadius: 'var(--radius-md)',
      fontFamily: 'var(--font-body)',
      fontWeight: '700',
      fontSize: '1.1rem',
    },
  };
  return styles[variant] || styles.primary;
};

// 工具函数：生成标题样式
export const getTitleStyle = (size = 'lg') => {
  const sizes = {
    sm: { fontSize: '1rem' },
    md: { fontSize: '1.25rem' },
    lg: { fontSize: '1.5rem' },
    xl: { fontSize: '2rem' },
    '2xl': { fontSize: '2.5rem' },
  };
  return {
    fontFamily: 'var(--font-heading)',
    color: 'var(--color-text)',
    fontWeight: '600',
    ...sizes[size],
  };
};

// 工具函数：生成描述样式
export const getDescStyle = () => ({
  fontFamily: 'var(--font-body)',
  color: 'var(--color-text-secondary)',
  lineHeight: '1.6',
});

export default {
  pageHeader,
  tabNav,
  card,
  sectionTitle,
  button,
  input,
  badge,
  progressBar,
  tipBox,
  emptyState,
  table,
  modal,
  createStyles,
  getCardStyle,
  getButtonStyle,
  getTitleStyle,
  getDescStyle,
};
