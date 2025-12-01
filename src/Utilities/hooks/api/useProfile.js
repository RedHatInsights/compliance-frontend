import useTableToolsQuery from '../useTableToolsQuery';

const convertToArray = ({ securityGuideId, profileId }) => [
  securityGuideId,
  profileId,
  undefined, // xRHIDENTITY
];

const useProfile = (options) =>
  useTableToolsQuery('profile', {
    ...options,
    requiredParams: ['securityGuideId', 'profileId'],
    convertToArray,
  });

export default useProfile;
