import React from 'react';
import JourneyContainer from '../components/Journey/JourneyContainer';
import PageContainer from '../components/Common/PageContainer';

const JourneyPage = () => {
  return (
    <PageContainer
      title="人生设计旅程"
      description="追踪你的人生设计进度，回顾成长轨迹，见证蜕变。"
    >
      <JourneyContainer />
    </PageContainer>
  );
};

export default JourneyPage;
