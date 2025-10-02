import useTableToolsQuery from '../useTableToolsQuery';

const convertToArray = ({ securityGuideId, profileId }) => [
  securityGuideId,
  profileId,
  undefined, // xRHIDENTITY
];

const useProfileTree = (options) =>
  useTableToolsQuery('profileTree', { ...options, convertToArray });

export default useProfileTree;
