import buildProfiles from './profiles';

const buildOSMajorVersions = (osVersions) =>
  osVersions.map((osMajorVersion) => {
    return {
      osMajorVersion,
      profiles: buildProfiles(5, {
        osMajorVersion,
        supportedOsVersions: [...new Array(5)].map(
          (_, minorVersion) => `${osMajorVersion}.${minorVersion}`
        ),
      }),
    };
  });

export default buildOSMajorVersions;
