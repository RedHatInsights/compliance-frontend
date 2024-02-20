import { Factory } from 'fishery';
import { faker } from '@faker-js/faker';
import { refId, randomNumbersArray, id } from './helpers';

import rules, { nonComplianceRules, manualRules } from './rules';
import benchmarks from './benchmarks';

const profilesFactory = Factory.define(
  ({ sequence, params, transientParams }) => {
    const osMajorVersion = params.osMajorVersion || '1';
    const osMinorVersions =
      transientParams.osMinorVersions ||
      randomNumbersArray(2).map((v) => `${v}`);

    return {
      ...id(),
      refId: refId('profile', sequence),
      name: `Profile #${sequence}`,
      osMajorVersion,
      supportedOsVersions: faker.helpers
        .arrayElements(osMinorVersions)
        .map((osMinorVersion) => `${osMajorVersion}.${osMinorVersion}`),
      benchmark: params.benchmark || benchmarks.build(),
      rules: rules.buildList(2),
      ...params,
    };
  }
);

const rulesFromFactories = (factories, allParams, allOptions) => {
  if (factories) {
    return factories.flatMap(({ factory, count, params, options }) =>
      factory.buildList(
        count,
        {
          ...allParams,
          ...params,
        },
        {
          ...allOptions,
          ...options,
        }
      )
    );
  }
};

export const testResultProfiles = Factory.define(
  ({ sequence, associations, params, transientParams }) => {
    const profile = {
      ...id(),
      refId: refId('profile', sequence),
      name: `Test Result Profile #${sequence}`,
      lastScanned: faker.date.recent({ days: 10 }),
      compliant: true,
      supported: true,
      description: faker.lorem.paragraph(),
      osMajorVersion: '9',
    };

    return {
      ...profile,
      rules:
        associations.rules ||
        rulesFromFactories(
          transientParams.ruleFactories || [{ factory: rules, count: 10 }],
          {},
          {
            transient: { profile },
          }
        ),
      ...params,
    };
  }
);

export const buildNonCompliantProfiles = (count = 5, attributes = {}) => {
  return testResultProfiles.buildList(
    count,
    {
      compliant: false,
      ...attributes,
    },
    {
      transient: {
        ruleFactories: [
          {
            factory: rules,
            count: 1,
          },
          {
            factory: nonComplianceRules,
            count: 1,
          },
          {
            factory: manualRules,
            count: 1,
          },
        ],
      },
    }
  );
};

export default profilesFactory;
