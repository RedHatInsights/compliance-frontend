import { useCallback, useState, useRef } from 'react';
import { useDeepCompareEffectNoCheck } from 'use-deep-compare-effect';

import useSecurityGuides from 'Utilities/hooks/api/useSecurityGuides';
import useProfiles from 'Utilities/hooks/api/useProfiles';
import useProfileRules from 'Utilities/hooks/api/useProfileRules';

const useProfileRuleIds = ({
  profileRefId,
  osMajorVersion,
  osMinorVersions,
  skip,
}) => {
  const mounted = useRef(true);
  const [profilesAndRuleIds, setProfilesAndRuleIds] = useState();
  const [loading, setLoading] = useState(true);
  const { query: fetchSecurityGuide } = useSecurityGuides({
    params: {
      limit: 1,
      idsOnly: true,
      sort: 'version:desc',
    },
    skip: true,
  });

  const { query: fetchProfiles } = useProfiles({
    params: {
      limit: 1,
      idsOnly: true,
      filters: `ref_id=${profileRefId}`,
    },
    skip: true,
  });

  const { queryTotalBatched: fetchProfileRules } = useProfileRules({
    params: { idsOnly: true },
    batched: true,
    batch: { batchSize: 100 },
    skip: true,
  });

  const fetchProfilesAndIdsForMinorVersion = useCallback(
    async (osMinorVersion) => {
      const ssg = (
        await fetchSecurityGuide({
          filters: `os_major_version=${osMajorVersion} AND supported_profile=${profileRefId}:${osMinorVersion}`,
        })
      )?.data?.[0];

      if (ssg) {
        const securityGuideId = ssg.id;
        const profileId = (await fetchProfiles({ securityGuideId })).data[0].id;
        const ruleIds = (
          await fetchProfileRules({ securityGuideId, profileId })
        ).data?.map(({ id }) => id);

        return [securityGuideId, profileId, ruleIds];
      } else {
        console.log(
          `No SSG found for ${profileRefId} on ${osMajorVersion}.${osMinorVersion}`,
        );
      }
    },
    [
      osMajorVersion,
      fetchProfileRules,
      fetchSecurityGuide,
      profileRefId,
      fetchProfiles,
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
        const profileAndIds =
          await fetchProfilesAndIdsForMinorVersion(osMinorVersion);

        if (profileAndIds?.length) {
          const [securityGuideId, profileId, ruleIds] = profileAndIds;

          profilesAndRuleIdsUpdated.push({
            osMajorVersion,
            osMinorVersion,
            securityGuideId,
            profileId,
            ruleIds,
          });
        }
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
