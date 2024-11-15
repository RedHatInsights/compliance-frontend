import { useCallback } from 'react';
import useProfileRules from '../../../Utilities/hooks/api/useProfileRules';
import useFetchTotalBatched from '../../../Utilities/hooks/useFetchTotalBatched';

// Requests GET /security_guides/{security_guide_id}/profiles/{profile_id}/rules?ids_only
const useProfileRuleIds = (securityGuideId, profileId, skip) => {
  const { fetch: fetchProfileRules } = useProfileRules({
    skip: true,
  });

  const fetchProfileRulesForBatch = useCallback(
    (offset, limit) =>
      fetchProfileRules(
        [securityGuideId, profileId, undefined, limit, offset, true],
        false
      ),
    [fetchProfileRules, securityGuideId, profileId]
  );
  const {
    loading: profileRuleIdsLoading,
    data: profileRuleIds,
    error: profileRuleIdsError,
  } = useFetchTotalBatched(
    skip === true ? undefined : fetchProfileRulesForBatch,
    {
      batchSize: 100,
      skip,
    }
  );

  return {
    profileRuleIds:
      profileRuleIds !== undefined
        ? profileRuleIds.flat().map(({ id }) => id)
        : profileRuleIds,
    loading: profileRuleIdsLoading,
    error: profileRuleIdsError,
  };
};

export default useProfileRuleIds;
