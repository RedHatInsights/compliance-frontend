import useComplianceQuery from '../useComplianceQuery';

const convertToArray = ({ limit, offset, idsOnly, sortBy, filter }) => [
  undefined, // xRHIDENTITY
  limit,
  offset,
  idsOnly,
  sortBy,
  filter,
];

const useSupportedProfiles = (options) =>
  useComplianceQuery('supportedProfiles', { ...options, convertToArray });

export default useSupportedProfiles;
