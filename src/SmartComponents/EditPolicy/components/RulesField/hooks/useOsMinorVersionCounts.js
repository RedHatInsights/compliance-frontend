import { useState, useEffect } from 'react';
import { mapCountOsMinorVersions } from 'Store/Reducers/SystemStore';

const profilesToOsMinorMap = (profiles, hosts) =>
  (profiles || []).reduce((acc, profile) => {
    if (profile.osMinorVersion !== '') {
      acc[profile.osMinorVersion] ||= {
        osMinorVersion: profile.osMinorVersion,
        count: 0,
      };
    }

    return acc;
  }, mapCountOsMinorVersions(hosts || []));

const policyProfilesMinorVersions = (policy) =>
  policy?.policy?.profiles
    .map(({ osMinorVersion }) => osMinorVersion)
    .filter((version) => version.length > 0);

const useOsMinorVersionCounts = (policy, systems) => {
  const [osMinorVersionCounts, setOsMinorVersionCounts] = useState({
    hasNewOS: false,
    policyOsMajorVersion: policy?.osMajorVersion,
    policyOsMinorVersions: [],
    systemsOsMinorVersions: [],
    systemsOsMinorVersionCounts: {},
  });

  useEffect(() => {
    const systemsOsMinorVersions = Object.keys(
      mapCountOsMinorVersions(systems?.value || [])
    );
    const policyOsMinorVersions = policyProfilesMinorVersions(policy);

    setOsMinorVersionCounts((currentState) => ({
      ...currentState,
      policyOsMinorVersions,
      systemsOsMinorVersions,
      hasNewOS: systemsOsMinorVersions > policyOsMinorVersions,
      systemsOsMinorVersionCounts: profilesToOsMinorMap(
        policy?.policy?.profiles,
        systems?.value
      ),
    }));
  }, [policy, systems]);

  return osMinorVersionCounts;
};

export default useOsMinorVersionCounts;
