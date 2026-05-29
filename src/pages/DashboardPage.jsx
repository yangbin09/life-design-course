import React from 'react';
import DashboardContainer from '../components/Dashboard/DashboardContainer';
import PageContainer from '../components/Common/PageContainer';

const DashboardPage = () => {
  return (
    <PageContainer
      title="人生仪表盘"
      description="诚实地评估你当前的能量状态，识别需要重点设计的领域。"
      badge="第一步：体检"
    >
      <DashboardContainer />
    </PageContainer>
  );
};

export default DashboardPage;
