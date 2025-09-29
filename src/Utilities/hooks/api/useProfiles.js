import useTableToolsQuery from '../useTableToolsQuery';

const convertToArray = ({
  securityGuideId,
  limit,
  offset,
  idsOnly,
  sort,
  filters,
}) => [
  securityGuideId,
  undefined, // xRHIDENTITY
  limit,
  offset,
  idsOnly,
  sort,
  filters,
];

const useProfiles = (options) =>
  useTableToolsQuery('profiles', {
    ...options,
    requiredParams: 'securityGuideId',
    convertToArray,
  });

export default useProfiles;
