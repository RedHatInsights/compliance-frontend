import useTableToolsQuery from '../useTableToolsQuery';

export const convertToArray = ({ policyId, tags, limit, offset, idsOnly, sort, filters }) => [
  policyId,
  undefined, // xRHIDENTITY
  tags,
  limit,
  offset,
  idsOnly,
  sort,
  filters,
];

const usePolicySystems = (options) =>
  useTableToolsQuery('policySystems', {
    ...options,
    requiredParams: 'policyId',
    convertToArray,
  });

export default usePolicySystems;
