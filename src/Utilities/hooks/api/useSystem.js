import useComplianceQuery from '../useComplianceQuery';

export const convertToArray = ({ systemId }) => [
  systemId,
  undefined, // xRHIDENTITY
];

const useSystems = (options) =>
  useComplianceQuery('system', {
    ...options,
    requiredParams: 'systemId',
    convertToArray,
  });

export default useSystems;
