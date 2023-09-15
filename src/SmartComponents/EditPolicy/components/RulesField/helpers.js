import { sortingByProp } from 'Utilities/helpers';

export const getBenchmarkBySupportedOsMinor = (benchmarks, osMinorVersion) =>
  benchmarks.find((benchmark) =>
    benchmark.latestSupportedOsMinorVersions?.includes(osMinorVersion)
  );

export const getBenchmarkProfile = (benchmark, profileRefId) =>
  benchmark?.profiles.find(
    (benchmarkProfile) => benchmarkProfile.refId === profileRefId
  );

export const toTabsData = (policy, osMinorVersionCounts, benchmarks = []) =>
  Object.values(osMinorVersionCounts)
    .sort(sortingByProp('osMinorVersion', 'desc'))
    .map(({ osMinorVersion, count: systemCount }) => {
      osMinorVersion = `${osMinorVersion}`;
      let profile = policy.policy.profiles.find(
        (profile) => profile.osMinorVersion === osMinorVersion
      );
      let osMajorVersion = policy.osMajorVersion;

      if (!profile && benchmarks) {
        const benchmark = getBenchmarkBySupportedOsMinor(
          benchmarks,
          osMinorVersion
        );
        if (benchmark) {
          const benchmarkProfile = getBenchmarkProfile(benchmark, policy.refId);
          if (benchmarkProfile) {
            profile = policy.policy.profiles.find(
              (profile) =>
                profile.parentProfileId === benchmarkProfile.id &&
                profile.osMinorVersion === osMinorVersion
            );

            profile = {
              ...benchmarkProfile,
              benchmark,
              osMajorVersion,
              ...profile,
            };
          }
        }
      }

      return {
        profile,
        systemCount,
        newOsMinorVersion: osMinorVersion,
      };
    })
    .filter(({ profile, newOsMinorVersion }) => !!profile && newOsMinorVersion);

export const ruleValues = (policy) => {
  const mergeValues = (policyId, values) => {
    return {
      ...values,
      // TODO
      // ...(ruleValuesProp?.[policyId] || {}),
    };
  };

  return Object.fromEntries(
    policy?.policy?.profiles?.map(
      ({ id, values, benchmark: { valueDefinitions } }) => [
        id,
        mergeValues(id, values, valueDefinitions),
      ]
    ) || []
  );
};
