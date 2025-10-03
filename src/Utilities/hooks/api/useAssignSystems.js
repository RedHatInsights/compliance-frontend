import useTableToolsQuery from '../useTableToolsQuery';

const convertToArray = ({ policyId, assignSystemsRequest }) => [
  policyId,
  undefined, // xRHIDENTITY,
  assignSystemsRequest,
];

const useAssignSystems = (options) =>
  useTableToolsQuery('assignSystems', {
    ...options,
    skip: true,
    convertToArray,
  });

export default useAssignSystems;
