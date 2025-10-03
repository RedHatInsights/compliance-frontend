import useTableToolsQuery from '../useTableToolsQuery';

const convertToArray = ({ policyId, policyUpdate }) => [
  policyId,
  undefined, // xRHIDENTITY,
  policyUpdate,
];

const useUpdatePolicy = (options) =>
  useTableToolsQuery('updatePolicy', {
    skip: true,
    ...options,
    convertToArray,
  });

export default useUpdatePolicy;
