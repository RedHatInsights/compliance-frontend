import buildSystems, {
  buildNonCompliantSystems,
  buildUnsupportedSystems,
} from '@/__factories__/systems';

export default () =>
  Promise.resolve({
    data: {
      systems: {
        edges: [
          ...buildSystems(1),
          ...buildNonCompliantSystems(1),
          ...buildUnsupportedSystems(1),
        ].map((system) => ({
          node: system,
        })),
      },
    },
  });
