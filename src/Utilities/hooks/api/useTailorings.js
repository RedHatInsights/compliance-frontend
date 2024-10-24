import useQuery from '../useQuery';
import useComplianceApi from './useComplianceApi';

// TODO investigate why this endpoint requires direct arguments and does not recognise the params object.
const useTailorings = (options) => {
  const tailoringsApi = useComplianceApi('tailorings');
  const query = useQuery(tailoringsApi, options);

  return query;
};

export default useTailorings;
