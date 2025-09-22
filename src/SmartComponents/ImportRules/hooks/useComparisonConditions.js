import { useCallback, useMemo, useState } from 'react';

const useComparisonConditions = ({ tailorings, securityGuideProfile }) => {
  const [comparisonConditions, setComparisonConditions] = useState({});

  const onComparisonSettingsChange = useCallback((setting, value) => {
    setComparisonConditions((currentComparisonConditions) => ({
      ...(setting !== 'tailoringId' ? currentComparisonConditions : {}),
      [setting]: value,
    }));
  }, []);

  const tailoring = tailorings?.find(
    ({ id }) => id === comparisonConditions?.tailoringId,
  );

  const sourceVersion = useMemo(
    () =>
      tailoring && {
        os_major_version: tailoring.os_major_version,
        os_minor_version: tailoring.os_minor_version,
        ssg_version: tailoring.security_guide_version,
      },
    [tailoring],
  );

  const targetVersion = useMemo(
    () =>
      securityGuideProfile &&
      comparisonConditions.osMinorVersion && {
        os_major_version: securityGuideProfile.os_major_version,
        os_minor_version: comparisonConditions.osMinorVersion,
        ssg_version: securityGuideProfile.security_guide_version,
      },
    [securityGuideProfile, comparisonConditions.osMinorVersion],
  );

  return {
    comparisonConditions,
    onComparisonSettingsChange,
    ...(tailoring
      ? {
          tailoring,
        }
      : {}),
    ...(sourceVersion ? { sourceVersion } : {}),
    ...(targetVersion ? { targetVersion } : {}),
  };
};

export default useComparisonConditions;
