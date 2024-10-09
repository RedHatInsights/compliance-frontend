import { faker } from '@faker-js/faker';
import dataSerialiser from './dataSerialiser';
import { id } from '../__factories__/helpers';

const createBasicTestObject = () => ({
  id: id(),
  name: faker.lorem.words(),
  total_systems: faker.number.int(1000),
});

const createNestedTestObject = () => ({
  id: id(),
  name: faker.lorem.words(),
  compliance_threshold: faker.number.int(100),
  policy: {
    ref_id: faker.lorem.slug(5),
    type: faker.lorem.words(3),
  },
  policies: [
    {
      id: id(),
      title: faker.lorem.words(1),
    },
  ],
});

describe('without map', () => {
  it('should return the input data', () => {
    const obj = createBasicTestObject();
    expect(dataSerialiser(obj)).toEqual(obj);
  });
});

describe('basic object', () => {
  it('should serialize correctly', () => {
    const dataMap = {
      id: 'id',
      name: 'title',
      total_systems: 'totalSystems',
    };
    const obj = createBasicTestObject();
    expect(dataSerialiser(obj, dataMap)).toEqual({
      id: obj.id,
      title: obj.name,
      totalSystems: obj.total_systems,
    });
  });
});

describe('basic array ', () => {
  it('should serialize correctly', () => {
    const dataMap = {
      id: 'id',
      name: 'title',
      total_systems: 'totalSystems',
    };

    const items = faker.helpers.multiple(createBasicTestObject, { count: 5 });
    expect(dataSerialiser(items, dataMap)).toEqual(
      items.map((item) => ({
        id: item.id,
        title: item.name,
        totalSystems: item.total_systems,
      }))
    );
  });
});

describe('nested object', () => {
  it('should serialize correctly', () => {
    const dataMap = {
      id: 'id',
      name: 'title',
      compliance_threshold: 'complianceThreshold',
      'policy.ref_id': 'policy.deeper.refId',
      'policy.type': 'policy.deeper.and.deeper.type',
    };

    const obj = createNestedTestObject();
    expect(dataSerialiser(obj, dataMap)).toEqual({
      id: obj.id,
      title: obj.name,
      complianceThreshold: obj.compliance_threshold,
      policy: {
        deeper: {
          refId: obj.policy.ref_id,
          and: {
            deeper: {
              type: obj.policy.type,
            },
          },
        },
      },
    });
  });
});

describe('nested object with multiple output paths', () => {
  it('should serialize correctly', () => {
    const dataMap = {
      id: ['id', 'policy.id'],
      name: ['title', 'desc'],
    };

    const obj = createNestedTestObject();
    expect(dataSerialiser(obj, dataMap)).toEqual({
      id: obj.id,
      title: obj.name,
      desc: obj.name,
      policy: {
        id: obj.id,
      },
    });
  });
});
