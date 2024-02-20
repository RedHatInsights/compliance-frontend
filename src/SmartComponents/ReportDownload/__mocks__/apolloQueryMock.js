import {
  buildNonCompliantSystems,
  buildUnsupportedSystems,
  buildSystemsWithTestResultProfiles,
} from '@/__factories__/systems';
import { graphqlResult } from '@/__factories__/helpers';

export default async () =>
  graphqlResult(undefined, {
    systems: [
      ...buildSystemsWithTestResultProfiles(1),
      ...buildNonCompliantSystems(1),
      ...buildUnsupportedSystems(1),
    ],
  }).result;
