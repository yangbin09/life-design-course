import { useCallback } from 'react';
import useLocalStorage from './useLocalStorage';
import { generateId, getTimestamp } from '../utils/storage';

const GRAVITY_QUESTIONS = [
  { id: 'g1', question: '这个问题是否涉及你无法改变的外部环境或条件？', yesHint: '可能是重力问题' },
  { id: 'g2', question: '你是否已经为解决这个问题尝试过多次，但都没有效果？', yesHint: '可能是重力问题' },
  { id: 'g3', question: '解决这个问题是否需要改变他人或社会？', yesHint: '可能是重力问题' },
  { id: 'g4', question: '这个问题是否与你过去的决定或无法逆转的事情有关？', yesHint: '可能是重力问题' },
  { id: 'g5', question: '你是否在等待某个条件满足后才能行动？', yesHint: '可能是重力问题' },
  { id: 'g6', question: '如果接受这个现实，你是否能在约束下设计更好的方案？', yesHint: '可以重新设计' },
];

export const usePrototype = () => {
  const [gravityAssessments, setGravityAssessments] = useLocalStorage('proto-gravity', []);
  const [interviews, setInterviews] = useLocalStorage('proto-interviews', []);
  const [microExperiences, setMicroExperiences] = useLocalStorage('proto-micro-exp', []);
  const [activeTab, setActiveTab] = useLocalStorage('proto-active-tab', 'gravity');

  // --- 重力问题 ---
  const addGravityAssessment = useCallback((assessment) => {
    const entry = {
      id: generateId(),
      problem: assessment.problem,
      answers: assessment.answers,
      result: assessment.result,
      reframed: assessment.reframed || '',
      timestamp: getTimestamp(),
    };
    setGravityAssessments(prev => [entry, ...prev]);
    return entry;
  }, [setGravityAssessments]);

  const removeGravityAssessment = useCallback((id) => {
    setGravityAssessments(prev => prev.filter(a => a.id !== id));
  }, [setGravityAssessments]);

  // --- 访谈准备 ---
  const addInterview = useCallback((interview) => {
    const entry = {
      id: generateId(),
      person: interview.person || '',
      role: interview.role || '',
      topic: interview.topic || '',
      questions: interview.questions || [],
      notes: interview.notes || '',
      status: 'planned', // planned | completed
      scheduledDate: interview.scheduledDate || '',
      timestamp: getTimestamp(),
    };
    setInterviews(prev => [entry, ...prev]);
    return entry;
  }, [setInterviews]);

  const updateInterview = useCallback((id, updates) => {
    setInterviews(prev =>
      prev.map(i => (i.id === id ? { ...i, ...updates } : i))
    );
  }, [setInterviews]);

  const removeInterview = useCallback((id) => {
    setInterviews(prev => prev.filter(i => i.id !== id));
  }, [setInterviews]);

  // --- 微体验 ---
  const addMicroExperience = useCallback((exp) => {
    const entry = {
      id: generateId(),
      title: exp.title || '',
      description: exp.description || '',
      goal: exp.goal || '',
      duration: exp.duration || '',
      cost: exp.cost || '低',
      status: 'planned', // planned | in-progress | completed
      learnings: '',
      timestamp: getTimestamp(),
    };
    setMicroExperiences(prev => [entry, ...prev]);
    return entry;
  }, [setMicroExperiences]);

  const updateMicroExperience = useCallback((id, updates) => {
    setMicroExperiences(prev =>
      prev.map(e => (e.id === id ? { ...e, ...updates } : e))
    );
  }, [setMicroExperiences]);

  const removeMicroExperience = useCallback((id) => {
    setMicroExperiences(prev => prev.filter(e => e.id !== id));
  }, [setMicroExperiences]);

  return {
    // 状态
    gravityQuestions: GRAVITY_QUESTIONS,
    gravityAssessments,
    interviews,
    microExperiences,
    activeTab,
    // 操作
    setActiveTab,
    addGravityAssessment,
    removeGravityAssessment,
    addInterview,
    updateInterview,
    removeInterview,
    addMicroExperience,
    updateMicroExperience,
    removeMicroExperience,
  };
};

export default usePrototype;
