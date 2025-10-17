import useTableToolsQuery from '../useTableToolsQuery';

const convertToArray = ({ policy }) => [
  undefined, // xRHIDENTITY
  policy,
];

const useCreatePolicy = (options) =>
  useTableToolsQuery('createPolicy', { ...options, convertToArray });

export default useCreatePolicy;
