import useTableToolsQuery from '../useTableToolsQuery';

const convertToArray = ({
  policyId,
  limit,
  offset,
  idsOnly,
  sort,
  filters,
}) => [
  policyId,
  undefined, // xRHIDENTITY
  limit,
  offset,
  idsOnly,
  sort,
  filters,
];

const useTailorings = (options) =>
  useTableToolsQuery('tailorings', {
    ...options,
    requiredParams: 'policyId',
    convertToArray,
  });

export default useTailorings;
