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

const useRules = (options) =>
  useTableToolsQuery('rules', {
    ...options,
    requiredParams: 'securityGuideId',
    convertToArray,
  });

export default useRules;
