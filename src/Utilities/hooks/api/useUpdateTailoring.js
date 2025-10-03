import useTableToolsQuery from '../useTableToolsQuery';

const convertToArray = ({ policyId, tailoringId, valuesUpdate }) => [
  policyId,
  tailoringId,
  undefined, // xRHIDENTITY,
  valuesUpdate,
];

const useUpdateTailoring = (options) =>
  useTableToolsQuery('updateTailoring', {
    skip: true,
    ...options,
    convertToArray,
  });

export default useUpdateTailoring;
