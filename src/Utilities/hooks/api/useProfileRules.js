import { useMemo } from 'react';
import useComplianceQuery from './useComplianceQuery';

const convertToArray = (params) => {
  if (Array.isArray(params)) {
    return params;
  } else {
    const {
      securityGuideId = undefined,
      profileId = undefined,
      limit = undefined,
      offset = undefined,
      idsOnly = undefined,
      sortBy = undefined,
      filter = undefined,
    } = params;

    return [
      securityGuideId,
      profileId,
      undefined, // xRHIDENTITY
      limit,
      offset,
      idsOnly,
      sortBy,
      filter,
    ];
  }
};

const useProfileRules = ({ params, skip, ...options }) => {
  const convertedParams = useMemo(() => convertToArray(params), [params]);

  return useComplianceQuery('profileRules', {
    ...options,
    params: convertedParams,
    skip,
  });
};

export default useProfileRules;
