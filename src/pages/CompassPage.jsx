import React from 'react';
import CompassContainer from '../components/Compass/CompassContainer';
import PageContainer from '../components/Common/PageContainer';

const CompassPage = () => {
  return (
    <PageContainer
      title="寻路指南针"
      description="当你的工作观（为什么工作）与人生观（人生的意义）一致时，你就找到了方向。"
    >
      <CompassContainer />
    </PageContainer>
  );
};

export default CompassPage;
