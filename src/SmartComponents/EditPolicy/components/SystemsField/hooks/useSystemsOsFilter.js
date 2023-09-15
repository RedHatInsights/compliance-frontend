import { useMemo } from 'react';

export const useSystemsOsFilter = (policy) => {
  return useMemo(() => {
    if (policy) {
      const { id: policyId, osMajorVersion, supportedOsVersions } = policy;
      const osMinorVersions = supportedOsVersions.map(
        (version) => version.split('.')[1]
      );
      const osFilter =
        osMajorVersion &&
        `os_major_version = ${osMajorVersion} AND os_minor_version ^ (${osMinorVersions.join(
          ','
        )})`;
      const defaultFilter = osFilter
        ? `${osFilter} or policy_id = ${policyId}`
        : `policy_id = ${policyId}`;

      return {
        defaultFilter,
        osMajorVersion,
      };
    } else {
      return {};
    }
  }, [policy]);
};

export default useSystemsOsFilter;
