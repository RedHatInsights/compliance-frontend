import useComplianceQuery from './useComplianceQuery';

// TODO investigate why this endpoint requires direct arguments and does not recognise the params object.
const useTailoringRules = (options) =>
  useComplianceQuery('tailoringRules', options);

export default useTailoringRules;
