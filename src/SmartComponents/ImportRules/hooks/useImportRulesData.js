import useTailorings from 'Utilities/hooks/api/useTailorings';
import usePolicy from 'Utilities/hooks/api/usePolicy';
import useSupportedProfiles from 'Utilities/hooks/api/useSupportedProfiles';

const useImportRulesData = ({ policyId }) => {
  const {
    data: { data: policy } = {},
    loading: policyLoading,
    error: policyError,
  } = usePolicy({ params: { policyId }, skip: !policyId });

  const {
    data: { data: supportedProfiles } = {},
    error: supportedProfilesError,
    loading: supportedProfilesLoading,
  } = useSupportedProfiles({
    params: {
      filter: `os_major_version=${policy?.os_major_version}`,
    },
    batched: true,
    skip: !policy,
  });

  const securityGuideProfile = supportedProfiles?.find(
    (profile) => profile.ref_id === policy?.ref_id,
  );

  const {
    data: { data: tailorings } = {},
    error: tailoringsError,
    loading: tailoringsLoading,
  } = useTailorings({
    params: {
      policyId,
      filter: 'NOT(null? os_minor_version)',
      skip: !policy,
    },
  });

  const data = {
    ...(policy ? { policy } : {}),
    ...(securityGuideProfile ? { securityGuideProfile } : {}),
    ...(tailorings ? { tailorings } : {}),
  };

  return {
    loading: policyLoading || supportedProfilesLoading || tailoringsLoading,
    error: policyError || supportedProfilesError || tailoringsError,
    ...(policy && tailorings && securityGuideProfile ? { data } : {}),
  };
};

export default useImportRulesData;
