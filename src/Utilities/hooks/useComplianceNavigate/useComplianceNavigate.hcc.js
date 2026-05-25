import useInsightsNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';

const useComplianceNavigate = (app, forcePreview) => {
  const insightsNavigate = useInsightsNavigate(app, forcePreview);

  return (to, preview) => insightsNavigate(to, preview);
};

export default useComplianceNavigate;
