import useComplianceQuery from '../useComplianceQuery';

const convertToArray = ({ limit, offset, idsOnly, sort, filters }) => [
  undefined, // xRHIDENTITY
  limit,
  offset,
  idsOnly,
  sort,
  filters,
];

const useSupportedProfiles = (options) =>
  useComplianceQuery('supportedProfiles', { ...options, convertToArray });

export default useSupportedProfiles;
