import useTableToolsQuery from '../useTableToolsQuery';

export const convertToArray = ({ policyId, filter }) => [
  policyId,
  undefined, // xRHIDENTITY
  filter,
];

const usePolicySystemsOS = (options) =>
  useTableToolsQuery('policySystemsOS', { ...options, convertToArray });

export default usePolicySystemsOS;
