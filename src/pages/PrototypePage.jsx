import React from 'react';
import PrototypeContainer from '../components/Prototype/PrototypeContainer';
import PageContainer from '../components/Common/PageContainer';

const PrototypePage = () => {
  return (
    <PageContainer
      title="原型设计"
      description="通过人生设计访谈和微体验，以最低成本验证你的想法。"
    >
      <PrototypeContainer />
    </PageContainer>
  );
};

export default PrototypePage;
