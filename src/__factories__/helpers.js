import { faker } from '@faker-js/faker';

const DEFAULT_REFID_PREFIX = 'xccdf_org.ssgproject.';

export const refId = (type, sequence, { prefix } = {}) =>
  `${prefix || DEFAULT_REFID_PREFIX}content_${type}_${sequence}`;

export const id = () => ({
  id: faker.string.uuid(),
});

export const hostname = () =>
  [faker.internet.domainWord(), faker.internet.domainName(), 'test'].join('.');

export const randomNumbersArray = (count, min = 0, max = 10) =>
  faker.helpers.uniqueArray(() => faker.number.int({ min, max }), count);

export const randomStringsArray = (count) =>
  faker.helpers.uniqueArray(faker.word.sample, count);

const wrapInNodes = (items) => ({
  nodes: items,
});

export const wrapInEdges = (items) => ({
  edges: items?.map((item) => ({ node: item })),
});

export const graphqlResult = (
  query,
  entities = {},
  { variables, inEdges = true } = {}
) => {
  const data = Object.fromEntries(
    Object.entries(entities).map(([type, items]) => {
      return [type, inEdges ? wrapInEdges(items) : wrapInNodes(items)];
    })
  );

  return {
    request: {
      query,
      variables,
    },
    result: {
      data,
    },
  };
};
