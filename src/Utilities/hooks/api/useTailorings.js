import useComplianceQuery from './useComplianceQuery';

// TODO investigate why this endpoint requires direct arguments and does not recognise the params object.
const useTailorings = (options) => useComplianceQuery('tailorings', options);

export default useTailorings;
