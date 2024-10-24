import useQuery from '../useQuery';
import useComplianceApi from './useComplianceApi';

const useSupportedProfiles = (options) => {
  const supportedProfilesApi = useComplianceApi('supportedProfiles');
  const query = useQuery(supportedProfilesApi, options);

  return query;
};

export default useSupportedProfiles;
