import useCollection from 'Utilities/hooks/api_v1/useCollection';

const compareAsIntegers = (firstString, secondString) =>
  parseInt(firstString) === parseInt(secondString);

const useSupportedSsgFinder = (skip) => {
  const { data: supportedSsgs } = useCollection('supported_ssgs', {
    type: 'supportedSsg',
    skip,
  });
  return (majorVersion, minorVersion) => {
    const matchingVersion = (supportedSsgs || {}).collection?.find(
      (profile) =>
        compareAsIntegers(profile.osMajorVersion, majorVersion) &&
        compareAsIntegers(profile.osMinorVersion, minorVersion)
    );

    return matchingVersion?.version || 'N/A';
  };
};

export default useSupportedSsgFinder;
