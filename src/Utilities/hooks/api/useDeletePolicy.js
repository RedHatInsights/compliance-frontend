import useTableToolsQuery from '../useTableToolsQuery';

const convertToArray = ({ policyId }) => [
  policyId,
  undefined, // xRHIDENTITY,
];

const useDeletePolicy = (options) =>
  useTableToolsQuery('deletePolicy', {
    ...options,
    requiredParams: 'policyId',
    skip: true,
    convertToArray,
  });

export default useDeletePolicy;
