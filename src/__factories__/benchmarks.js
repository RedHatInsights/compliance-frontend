import { Factory } from 'fishery';
import { faker } from '@faker-js/faker';
import { id, refId } from './helpers';
import ruleTree from './ruleTree';
import profiles from './profiles';

const benchmarksFactory = Factory.define(
  ({ sequence, params, transientParams }) => {
    const latestSupportedOsMinorVersions =
      transientParams.osVersions &&
      faker.helpers.arrayElements(transientParams.osVersions);

    const benchmark = {
      ...id(),
      refId: refId('benchmark', sequence),
      ...(transientParams.withVersion
        ? { version: faker.system.semver() }
        : {}),
      ...(latestSupportedOsMinorVersions
        ? { latestSupportedOsMinorVersions }
        : {}),
    };

    return {
      ...benchmark,
      ...(transientParams.withProfile
        ? {
            ruleTree: ruleTree.build(),
            profiles: [
              ...profiles.buildList(10, { benchmark }),
              ...((transientParams.profile && [transientParams.profile]) || []),
            ],
            valueDefinitions: {},
          }
        : {}),
      ...params,
    };
  }
);

export const benchmarksWithProfilesFactory = benchmarksFactory.transient({
  withProfile: true,
});

export default benchmarksFactory;
