import React from 'react';
import JournalContainer from '../components/Journal/JournalContainer';
import PageContainer from '../components/Common/PageContainer';

const JournalPage = () => {
  return (
    <PageContainer
      title="好时光日志"
      description="记录那些让你充满能量（Energy）和全情投入（Engagement）的活动，发现真正热爱的事。"
    >
      <JournalContainer />
    </PageContainer>
  );
};

export default JournalPage;
