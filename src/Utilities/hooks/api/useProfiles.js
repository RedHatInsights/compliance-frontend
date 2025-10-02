import useTableToolsQuery from '../useTableToolsQuery';

const convertToArray = ({
  securityGuideId,
  limit,
  offset,
  idsOnly,
  sortBy,
  filter,
}) => [
  securityGuideId,
  undefined, // xRHIDENTITY
  limit,
  offset,
  idsOnly,
  sortBy,
  filter,
];

const useProfiles = (options) =>
  useTableToolsQuery('profiles', { ...options, convertToArray });

export default useProfiles;
