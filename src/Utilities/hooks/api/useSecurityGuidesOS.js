import useQuery from '../useQuery';
import useComplianceApi from './useComplianceApi';

const useSecurityGuidesOS = (options) => {
  const securityGuidesOSApi = useComplianceApi('securityGuidesOS');
  const query = useQuery(securityGuidesOSApi, options);

  return query;
};

export default useSecurityGuidesOS;
