import useInsightsNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';

/**
 * HCC build: delegates to Insights chrome navigation.
 */
const useComplianceNavigate = (app, forcePreview) => {
  const insightsNavigate = useInsightsNavigate(app, forcePreview);

  return (to, preview) => insightsNavigate(to, preview);
};

export default useComplianceNavigate;
