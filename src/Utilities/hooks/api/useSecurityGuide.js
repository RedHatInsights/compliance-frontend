import useTableToolsQuery from '../useTableToolsQuery';

const convertToArray = ({ securityGuideId }) => [
  securityGuideId,
  undefined, // xRHIDENTITY
];

const useSecurityGuide = (options) =>
  useTableToolsQuery('securityGuide', {
    ...options,
    requiredParams: 'securityGuideId',
    convertToArray,
  });

export default useSecurityGuide;
