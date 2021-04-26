import { useQuery } from '@apollo/client';
import { sortingByProp } from 'Utilities/helpers';
import { BENCHMARKS_QUERY, PROFILES_QUERY } from './constants';

export const useTabsData = (policy, osMinorVersionCounts) => {
    const getBenchmarkBySupportedOsMinor = (benchmarks, osMinorVersion) => (
        benchmarks.find((benchmark) =>
            benchmark.latestSupportedOsMinorVersions?.includes(osMinorVersion)
        )
    );

    const getBenchmarkProfile = (benchmark, profileRefId) => (
        benchmark.profiles.find((benchmarkProfile) => (benchmarkProfile.refId === profileRefId))
    );

    return (benchmarks = [], selectedRuleRefIds = []) => (
        Object.values(osMinorVersionCounts).sort(
            sortingByProp('osMinorVersion', 'desc')
        ).map(({ osMinorVersion, count: systemCount }) => {
            osMinorVersion = `${osMinorVersion}`;
            let profile = policy.policy.profiles.find((profile) => (profile.osMinorVersion === osMinorVersion));
            let osMajorVersion = policy.osMajorVersion;

            if (!profile && benchmarks) {
                const benchmark = getBenchmarkBySupportedOsMinor(benchmarks, osMinorVersion);
                if (benchmark) {
                    const benchmarkProfile = getBenchmarkProfile(benchmark, policy.refId);
                    if (benchmarkProfile) {
                        profile = policy.policy.profiles.find((profile) => (profile.parentProfileId === benchmarkProfile.id));

                        profile = {
                            ...benchmarkProfile,
                            benchmark,
                            osMajorVersion,
                            ...profile
                        };
                    }
                }
            }

            return {
                profile,
                systemCount,
                newOsMinorVersion: osMinorVersion,
                selectedRuleRefIds: selectedRuleRefIds?.find(({ id }) => id === profile?.id)?.ruleRefIds
            };
        }).filter(({ profile, newOsMinorVersion }) => !!profile && newOsMinorVersion)
    );
};

export const useBenchmarksQuery = (policy, osMinorVersionCounts) => {
    const osMajorVersion = policy?.osMajorVersion;
    const osMinorVersions = Object.keys(osMinorVersionCounts).sort();
    const benchmarkSearch = `os_major_version = ${ osMajorVersion } ` +
        `and latest_supported_os_minor_version ^ "${ osMinorVersions.join(',') }"`;

    return useQuery(BENCHMARKS_QUERY, {
        variables: {
            filter: benchmarkSearch
        },
        skip: osMinorVersions.length === 0
    });
};

export const useProfilesQuery = (tabsData) => {
    const profileIds = tabsData.map((tab) => (tab.profile.id));
    const filter = `${ profileIds.map((i) => (`id = ${ i }`)).join(' OR ') }`;

    return useQuery(PROFILES_QUERY, {
        variables: {
            filter
        },
        skip: filter.length === 0
    });
};
