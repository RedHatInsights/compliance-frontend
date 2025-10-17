import useTableToolsQuery from '../useTableToolsQuery';

const convertToArray = ({ limit, offset, idsOnly, sort, filters }) => [
  undefined, // xRHIDENTITY
  limit,
  offset,
  idsOnly,
  sort,
  filters,
];

const useSupportedProfiles = (options) =>
  useTableToolsQuery('supportedProfiles', { ...options, convertToArray });

export default useSupportedProfiles;
