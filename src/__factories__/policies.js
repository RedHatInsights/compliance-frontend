import { faker } from '@faker-js/faker';

const buildPolicy = (
  { supportedOsVersions, ...attributes } = {
    supportedOsVersions: ['7.8', '7.9'],
  }
) => {
  return {
    id: faker.string.uuid(),
    name: faker.string.alpha(10),
    refId: faker.string.alpha(15),
    description: faker.string.alpha(100),
    totalHostCount: 0,
    compliantHostCount: 0,
    complianceThreshold: 80,
    osMajorVersion: '7',
    lastScanned: undefined,
    supportedOsVersions,
    policy: {
      profiles: supportedOsVersions.map((osVersion) => {
        const [, minorOsVersion] = osVersion.split('.');
        return {
          minorOsVersion,
        };
      }),
    },
    hosts: [{ id: 'HOST ID' }],
    ...attributes,
  };
};

export default buildPolicy;
