import useQuery from '../useQuery';
import useComplianceApi from './useComplianceApi';

// TODO investigate why this endpoint requires direct arguments and does not recognise the params object.
const useTailoringRules = (options) => {
  const tailoringRulesApi = useComplianceApi('tailoringRules');
  const query = useQuery(tailoringRulesApi, options);

  return query;
};

export default useTailoringRules;
