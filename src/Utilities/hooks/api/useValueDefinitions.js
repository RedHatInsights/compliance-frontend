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

const useValueDefinitions = (options) =>
  useTableToolsQuery('valueDefinitions', {
    ...options,
    requiredParams: 'securityGuideId',
    convertToArray,
  });

export default useValueDefinitions;
