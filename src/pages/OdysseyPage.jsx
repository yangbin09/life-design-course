import React from 'react';
import OdysseyContainer from '../components/Odyssey/OdysseyContainer';
import PageContainer from '../components/Common/PageContainer';

const OdysseyPage = () => {
  return (
    <PageContainer
      title="奥德赛计划"
      description="为你的未来设计三个截然不同的版本，并对它们进行压力测试。"
    >
      <OdysseyContainer />
    </PageContainer>
  );
};

export default OdysseyPage;
