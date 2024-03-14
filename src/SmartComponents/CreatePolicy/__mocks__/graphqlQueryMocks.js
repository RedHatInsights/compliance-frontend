import { faker } from '@faker-js/faker';
import { graphqlResult } from '@/__factories__/helpers';
import { osMajorVersionsFromArray } from '@/__factories__/osMajorVersions.js';
import systems from '@/__factories__/systems.js';
import benchmarks from '@/__factories__/benchmarks.js';
import { countOsMinorVersions } from 'Store/Reducers/SystemStore';
import {
  SUPPORTED_PROFILES,
  BENCHMARKS_QUERY,
  BENCHMARKS_RULES_TREES_QUERY,
  BENCHMARKS_VALUE_DEFINITIONS_QUERY,
  PROFILES_QUERY,
} from '../constants';
import { GET_SYSTEMS_OSES } from '../../SystemsTable/constants';
import { BENCHMARK_QUERY } from '@/PresentationalComponents/TabbedRules/ProfileTabContent';

export default (osVersions) => {
  const osMajorVersions = osMajorVersionsFromArray(osVersions);
  const osMajorVersionToSelect = faker.helpers.arrayElement(osMajorVersions);

  const [profileToSelect, randomInUseProfile] = faker.helpers.arrayElements(
    osMajorVersionToSelect.profiles
  );
  const systemsToSelect = systems.buildList(
    1,
    {},
    { transient: { osVersions: profileToSelect.supportedOsVersions } }
  );

  const randomSystems = faker.helpers.arrayElements(systemsToSelect, {
    min: 1,
    max: systemsToSelect.length,
  });
  const randomSystemsCounts = countOsMinorVersions(randomSystems);

  const benchmarksForProfile = benchmarks.buildList(
    randomSystemsCounts.length,
    {},
    {
      transient: {
        profile: profileToSelect,
        osVersions: randomSystemsCounts.map(
          ({ osMinorVersion }) => `${osMinorVersion}`
        ),
      },
    }
  );

  const benchmarksFilter = `os_major_version = ${
    osMajorVersionToSelect.osMajorVersion
  } and latest_supported_os_minor_version ^ "${randomSystemsCounts
    .map(({ osMinorVersion }) => `${osMinorVersion}`)
    .sort()
    .join(',')}"`;

  const benchmarkResultOptions = {
    variables: {
      filter: benchmarksFilter,
    },
    inEdges: false,
  };

  const mocks = [
    graphqlResult(SUPPORTED_PROFILES, {
      osMajorVersions,
      profiles: randomInUseProfile ? [randomInUseProfile] : [],
    }),

    // This silence the apollo mock provider warning on the Systems step
    graphqlResult(
      GET_SYSTEMS_OSES,
      {},
      {
        variables: {
          filter: `os_major_version = ${
            osMajorVersionToSelect.osMajorVersion
          } AND os_minor_version ^ (${profileToSelect.supportedOsVersions
            .map((v) => v.split('.')[1])
            .join(',')})`,
        },
      }
    ),

    graphqlResult(
      BENCHMARKS_QUERY,
      {
        benchmarks: benchmarksForProfile,
      },
      benchmarkResultOptions
    ),
    graphqlResult(
      BENCHMARKS_RULES_TREES_QUERY,
      {
        benchmarks: benchmarksForProfile.map(({ id, ruleTree }) => ({
          id,
          ruleTree,
        })),
      },
      benchmarkResultOptions
    ),
    graphqlResult(
      BENCHMARKS_VALUE_DEFINITIONS_QUERY,
      {
        benchmarks: benchmarksForProfile,
      },
      benchmarkResultOptions
    ),
    graphqlResult(
      PROFILES_QUERY,
      {
        profiles: benchmarksForProfile,
      },
      {
        variables: {
          filter: `id = ${profileToSelect.id}`,
        },
      }
    ),

    graphqlResult(
      BENCHMARK_QUERY,
      {},
      {
        variables: {},
      }
    ),
  ];

  const mockResults = {
    mocks,
    osMajorVersionToSelect,
    profileToSelect,
    randomSystems,
    randomSystemsCounts,
  };

  return mockResults;
};
