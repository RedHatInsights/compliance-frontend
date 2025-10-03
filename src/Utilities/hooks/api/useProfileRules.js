import useTableToolsQuery from '../useTableToolsQuery';

const convertToArray = ({
  securityGuideId,
  profileId,
  limit,
  offset,
  idsOnly,
  sort,
  filters,
}) => [
  securityGuideId,
  profileId,
  undefined, // xRHIDENTITY
  limit,
  offset,
  idsOnly,
  sort,
  filters,
];

const useProfileRules = (options) =>
  useTableToolsQuery('profileRules', {
    ...options,
    requiredParams: ['profileId', 'securityGuideId'],
    convertToArray,
  });

export default useProfileRules;
