import useTableToolsQuery from '../useTableToolsQuery';

const convertToArray = ({
  policyId,
  tailoringId,
  limit,
  offset,
  idsOnly,
  sort,
  filters,
}) => [
  policyId,
  tailoringId,
  undefined, // xRHIDENTITY
  limit,
  offset,
  idsOnly,
  sort,
  filters,
];

const useTailoringRules = (options) =>
  useTableToolsQuery('tailoringRules', { ...options, convertToArray });

export default useTailoringRules;
