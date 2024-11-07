import { useCallback } from 'react';
import useRules from '../../../Utilities/hooks/api/useRules';
import useSecurityGuides from '../../../Utilities/hooks/api/useSecurityGuides';

/**
 * useGetSelectedProfileRules
 *  @param   {*} majorVersion OS major version (RHEL)
 *  @param   {*} minorVersion OS minor version (RHEL)
 *  @param   {*} profileRefId The reference ID of a chosen profile. This ID will be used to look up the security guides and associated rules
 *  @returns                  // TODO: describe the return function
 */
const useGetSelectedProfileRules = (
  majorVersion,
  minorVersion,
  profileRefId
) => {
  const { fetch: fetchSecurityGuides } = useSecurityGuides({
    skip: true,
  });
  const { fetch: fetchRules } = useRules({
    skip: true,
  });

  const getSelectedProfileRules = useCallback(async () => {
    try {
      const securityGuides = await fetchSecurityGuides(
        {
          filter: `os_major_version=${majorVersion} AND os_minor_version=${minorVersion} AND profile_ref_id=${profileRefId}`,
        },
        false
      );
      const securityGuideIds = securityGuides.data.map(({ id }) => id);
      const rulesResponses = await Promise.all(
        securityGuideIds.map((id) => fetchRules([id], false))
      );
      const rules = rulesResponses.flatMap(({ data }) => data);

      return rules;
    } catch (error) {
      // TODO: enhance the error handling
      console.error('Error while requesting available profile rules', error);

      return [];
    }
  }, [
    fetchSecurityGuides,
    fetchRules,
    majorVersion,
    minorVersion,
    profileRefId,
  ]);

  return getSelectedProfileRules;
};

export default useGetSelectedProfileRules;
