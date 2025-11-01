import useTableToolsQuery from '../useTableToolsQuery';

export const convertToArray = ({
  policyId,
  tags,
  limit,
  offset,
  idsOnly,
  sort,
  filters,
  filter,
}) => {
  return [
    policyId,
    undefined, // xRHIDENTITY
    tags,
    limit,
    offset,
    idsOnly,
    sort,
    // support both 'filters' and 'filter' keys until Inventory migrated to tabletools
    filters || filter,
  ];
};

const usePolicySystems = (options) =>
  useTableToolsQuery('policySystems', {
    ...options,
    requiredParams: 'policyId',
    convertToArray,
  });

export default usePolicySystems;
