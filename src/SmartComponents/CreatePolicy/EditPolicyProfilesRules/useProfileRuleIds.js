import { useCallback } from 'react';
import useProfileRules from '../../../Utilities/hooks/api/useProfileRules';
import useFetchTotalBatched from '../../../Utilities/hooks/useFetchTotalBatched';

// Requests GET /security_guides/{security_guide_id}/profiles/{profile_id}/rules?ids_only
const useProfileRuleIds = (securityGuideId, profileId) => {
  const { fetch: fetchProfileRules } = useProfileRules({
    skip: true,
  });
  const fetchProfileRulesForBatch = useCallback(
    (offset, limit) =>
      fetchProfileRules(
        { securityGuideId, profileId, idsOnly: true, limit, offset },
        false
      ),
    [fetchProfileRules, securityGuideId, profileId]
  );
  const {
    loading: profileRuleIdsLoading,
    data: profileRuleIds,
    error: profileRuleIdsError,
  } = useFetchTotalBatched(fetchProfileRulesForBatch, {
    batchSize: 100,
  });

  return {
    profileRuleIds,
    loading: profileRuleIdsLoading,
    error: profileRuleIdsError,
  };
};

export default useProfileRuleIds;
