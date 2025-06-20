import { useCallback, useState, useRef } from 'react';
import { useDeepCompareEffectNoCheck } from 'use-deep-compare-effect';

import useSecurityGuides from 'Utilities/hooks/api/useSecurityGuides';
import useProfiles from 'Utilities/hooks/api/useProfiles';
import useProfileRules from 'Utilities/hooks/api/useProfileRules';
import useFetchTotalBatched from 'Utilities/hooks/useFetchTotalBatched';

const useProfileRuleIds = ({
  profileRefId,
  osMajorVersion,
  osMinorVersions,
  skip,
}) => {
  const mounted = useRef(true);
  const [profilesAndRuleIds, setProfilesAndRuleIds] = useState();
  const [loading, setLoading] = useState(true);
  const { fetch: fetchSecurityGuide } = useSecurityGuides({
    params: {
      limit: 1,
      idsOnly: true,
      sortBy: 'version:desc',
    },
    skip: true,
  });

  const { fetch: fetchProfiles } = useProfiles({
    params: {
      limit: 1,
      idsOnly: true,
      filter: `ref_id=${profileRefId}`,
    },
    skip: true,
  });

  const { fetch: fetchProfileRules } = useProfileRules({
    params: { idsOnly: true },
    skip: true,
  });

  const fetchProfileRulesForBatch = useCallback(
    async (offset, limit, params) =>
      await fetchProfileRules({ limit, offset, ...params }, false),
    [fetchProfileRules],
  );
  const { fetch: fetchRulesBatched } = useFetchTotalBatched(
    fetchProfileRulesForBatch,
    {
      batchSize: 100,
      skip: true,
      withMeta: true,
    },
  );

  const fetchProfilesAndIdsForMinorVersion = useCallback(
    async (osMinorVersion) => {
      const securityGuideId = (
        await fetchSecurityGuide(
          {
            filter: `os_major_version=${osMajorVersion} AND supported_profile=${profileRefId}:${osMinorVersion}`,
          },
          false,
        )
      ).data[0].id;
      const profileId = (await fetchProfiles({ securityGuideId }, false))
        .data[0].id;
      const ruleIds = (
        await fetchRulesBatched({ securityGuideId, profileId })
      ).data?.map(({ id }) => id);

      return [securityGuideId, profileId, ruleIds];
    },
    [
      osMajorVersion,
      fetchProfiles,
      fetchRulesBatched,
      fetchSecurityGuide,
      profileRefId,
    ],
  );

  useDeepCompareEffectNoCheck(() => {
    const fetchMinorOsRuleIds = async () => {
      const profilesAndRuleIdsUpdated = structuredClone(
        profilesAndRuleIds || [],
      );

      for (const osMinorVersion of osMinorVersions) {
        if (
          profilesAndRuleIdsUpdated.find(
            ({ osMinorVersion: _osMinorVersion }) =>
              _osMinorVersion === osMinorVersion,
          ) !== undefined
        )
          continue; // skip this version since already fetched

        const [securityGuideId, profileId, ruleIds] =
          await fetchProfilesAndIdsForMinorVersion(osMinorVersion);

        profilesAndRuleIdsUpdated.push({
          osMajorVersion,
          osMinorVersion,
          securityGuideId,
          profileId,
          ruleIds,
        });
      }

      mounted.current && setProfilesAndRuleIds(profilesAndRuleIdsUpdated);
      setLoading(undefined);
    };

    if (osMinorVersions?.length && !skip) {
      setLoading(true);
      fetchMinorOsRuleIds();
    }

    return () => {
      // mounted.current = false; // TODO: investigate why this is called unexpectedly
    };
  }, [osMinorVersions, skip]);

  return {
    profilesAndRuleIds,
    loading,
    error: undefined, // TODO Add error handling
  };
};

export default useProfileRuleIds;
