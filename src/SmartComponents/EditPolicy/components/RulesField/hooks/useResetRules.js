import { useCallback, useEffect } from 'react';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import { profilesWithRulesToSelection } from 'PresentationalComponents/TabbedRules';
import {
  getBenchmarkBySupportedOsMinor,
  getBenchmarkProfile,
} from '../helpers';

const useResetRules = (policy, systemsOsMinorVersions, benchmarks) => {
  const { change, getFieldState } = useFormApi();
  const rules = getFieldState('rules');
  // Default rules for each profile/benchmark
  // const defaultRules = useMemo(() => {}, []);

  // Rules from the policy set by the user
  // const policyRules = useMemo(() => {}, []);

  const reset = useCallback(() => {
    change('rules');
  }, [change, rules]);

  useEffect(() => {
    const policyProfilesMinorVersions = policy?.policy?.profiles
      .map(({ osMinorVersion }) => osMinorVersion)
      .filter((version) => version.length > 0);
    const newSystemsOsMinorVersions = systemsOsMinorVersions.filter(
      (version) => !policyProfilesMinorVersions.includes(version)
    );
    const policyHasNewMinorVersions = newSystemsOsMinorVersions.length > 0;

    if (policyHasNewMinorVersions) {
      console.log('Has new versions', benchmarks, rules.value);
      const currentProfileIds = rules.value.map(({ id }) => id);
      const newProfiles = newSystemsOsMinorVersions
        .map((version) => {
          const benchmarkProfile = getBenchmarkProfile(
            getBenchmarkBySupportedOsMinor(benchmarks || [], version),
            policy.refId
          );

          return benchmarkProfile
            ? {
                ...benchmarkProfile,
                osMinorVersion: version,
              }
            : undefined;
        })
        .filter(
          (profile) => !!profile && !currentProfileIds.includes(profile.id)
        );
      console.log(newProfiles);
      if (newProfiles.length > 0) {
        const newRules = profilesWithRulesToSelection(newProfiles);
        console.log(rules.value, newRules);
        change('rules', [...rules.value, ...newRules]);
      }
    }
  }, [policy, systemsOsMinorVersions, benchmarks, rules]);

  return {
    reset,
  };
};

export default useResetRules;
