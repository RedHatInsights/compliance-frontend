export const optionsFromTailorings = (tailorings) =>
  tailorings.map((tailoring) => ({
    label: `RHEL ${tailoring.os_major_version}.${tailoring.os_minor_version}`,
    value: tailoring.id,
    ssgVersion: tailoring.security_guide_version,
  }));

export const optionsFromSecurityGuideProfileVersions = (
  securityGuideProfile,
  selectedVersion,
  preSelectedMinorVersion,
) =>
  securityGuideProfile?.os_minor_versions
    .filter(
      (version) =>
        version > selectedVersion ||
        version === Number(preSelectedMinorVersion),
    )
    .map((currentMinorVersion) => ({
      label: `RHEL ${securityGuideProfile.os_major_version}.${currentMinorVersion}`,
      value: currentMinorVersion,
      ssgVersion: securityGuideProfile.security_guide_version,
    }));
