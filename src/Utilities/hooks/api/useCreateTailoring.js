import useTableToolsQuery from '../useTableToolsQuery';

const convertToArray = ({ policyId, tailoringCreate }) => [
  policyId,
  undefined, // xRHIDENTITY
  tailoringCreate,
];

const useCreateTailoring = (options) =>
  useTableToolsQuery('createTailoring', { ...options, convertToArray });

export default useCreateTailoring;
