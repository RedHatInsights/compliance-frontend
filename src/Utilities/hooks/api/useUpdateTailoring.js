import useTableToolsQuery from '../useTableToolsQuery';

const convertToArray = ({ policyId, tailoringId, valuesUpdate }) => [
  policyId,
  tailoringId,
  undefined, // xRHIDENTITY,
  valuesUpdate,
];

const useUpdateTailoring = (options) =>
  useTableToolsQuery('updateTailoring', {
    ...options,
    requiredParams: ['policyId', 'tailoringId'],
    skip: true,
    convertToArray,
  });

export default useUpdateTailoring;
