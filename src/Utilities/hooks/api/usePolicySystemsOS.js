import useTableToolsQuery from '../useTableToolsQuery';

export const convertToArray = ({ policyId, filters, filter }) => [
  policyId,
  undefined, // xRHIDENTITY
  // support both 'filters' and 'filter' keys until Inventory migrated to tabletools
  filters || filter,
];

const usePolicySystemsOS = (options) =>
  useTableToolsQuery('policySystemsOS', {
    ...options,
    requiredParams: 'policyId',
    convertToArray,
  });

export default usePolicySystemsOS;
