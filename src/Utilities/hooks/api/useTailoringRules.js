import useComplianceQuery from '../useComplianceQuery';

const convertToArray = ({
  policyId,
  tailoringId,
  limit,
  offset,
  idsOnly,
  sortBy,
  filter,
}) => [
  policyId,
  tailoringId,
  undefined, // xRHIDENTITY
  limit,
  offset,
  idsOnly,
  sortBy,
  filter,
];

// TODO investigate why this endpoint requires direct arguments and does not recognise the params object.
const useTailoringRules = (options) =>
  useComplianceQuery('tailoringRules', { ...options, convertToArray });

export default useTailoringRules;
