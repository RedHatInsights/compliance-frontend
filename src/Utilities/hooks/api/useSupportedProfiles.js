import useComplianceQuery from './useComplianceQuery';

const useSupportedProfiles = (options) =>
  useComplianceQuery('supportedProfiles', options);

export default useSupportedProfiles;
