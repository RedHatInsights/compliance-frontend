import useTableToolsQuery from '../useTableToolsQuery';

const convertToArray = ({ policyId }) => [
  policyId,
  undefined, // xRHIDENTITY
];

const usePolicy = (options) =>
  useTableToolsQuery('policy', {
    ...options,
    requiredParams: 'policyId',
    convertToArray,
  });

export default usePolicy;
