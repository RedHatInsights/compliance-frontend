import { Factory } from 'fishery';

import { randomNumbersArray } from './helpers';
import profiles from './profiles';

const DEFAULT_OS_MAJOR_VERSION = '9';

const osMajorVersionsFactory = Factory.define(({ params }) => {
  const osMajorVersion = params.osMajorVersion || DEFAULT_OS_MAJOR_VERSION;
  const osMinorVersions =
    params.supportedOsVersions || randomNumbersArray(2).map((v) => `${v}`);

  return {
    osMajorVersion: parseInt(osMajorVersion),
    profiles: osMinorVersions.map(() => {
      return profiles.build(
        {
          osMajorVersion,
        },
        {
          transient: {
            osMinorVersions,
          },
        }
      );
    }),
    ...params,
  };
});

export const osMajorVersionsFromArray = (versions) => {
  return versions.map((osMajorVersion) =>
    osMajorVersionsFactory.build({ osMajorVersion })
  );
};

export default osMajorVersionsFactory;
