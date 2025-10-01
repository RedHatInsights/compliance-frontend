import useTableToolsQuery from '../useTableToolsQuery';

export const convertToArray = ({ policyId, filters }) => [
  policyId,
  undefined, // xRHIDENTITY
  filters,
];

const usePolicySystemsOS = (options) =>
  useTableToolsQuery('policySystemsOS', { ...options, convertToArray });

export default usePolicySystemsOS;
