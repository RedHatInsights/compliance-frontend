import useTableToolsQuery from '../useTableToolsQuery';

const convertToArray = ({ policyId, policyUpdate }) => [
  policyId,
  undefined, // xRHIDENTITY,
  policyUpdate,
];

const useUpdatePolicy = (options) =>
  useTableToolsQuery('updatePolicy', {
    ...options,
    requiredParams: 'policyId',
    skip: true,
    convertToArray,
  });

export default useUpdatePolicy;
