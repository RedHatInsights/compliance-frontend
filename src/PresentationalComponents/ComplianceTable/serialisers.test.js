import { stringToId } from '@/Frameworks/AsyncTableTools/hooks/useFilterConfig/helpers';
import filters from 'Utilities/hooks/useTableTools/__fixtures__/filters';

import { filtersSerialiser, sortSerialiser } from './serialisers';

const filtersWithIds = filters.map((filter) => ({
  id: stringToId(filter.label),
  ...filter,
}));

describe('filtersSerialiser', () => {
  it('should not return anything with no active filters', () => {
    expect(filtersSerialiser({}, filtersWithIds)).not.toBeDefined();
  });

  it('should return a scoped search query for text filters', () => {
    expect(filtersSerialiser({ name: 'testvalue' }, filtersWithIds)).toEqual(
      'name ~ "testvalue"'
    );
  });

  it('should return a scoped search query for checkbox filters', () => {
    expect(
      filtersSerialiser(
        {
          'checkbox-filter': ['OPTION_1', 'OPTION_2'],
        },
        filtersWithIds
      )
    ).toEqual('checkbox ^ (OPTION_1 OPTION_2)');
  });

  it('should return a scoped search query for radio filters', () => {
    expect(
      filtersSerialiser(
        {
          'radio-filter': ['OPTION 1'],
        },
        filtersWithIds
      )
    ).toEqual('radio = "OPTION 1"');
  });

  it('should return a scoped search query for multiple filters', () => {
    expect(
      filtersSerialiser(
        {
          'radio-filter': ['OPTION_1'],
          'checkbox-filter': ['OPTION_1', 'OPTION_2'],
        },
        filtersWithIds
      )
    ).toEqual('radio = "OPTION_1" AND checkbox ^ (OPTION_1 OPTION_2)');
  });

  it('should use a filterSerialiser if provided in the filter config', () => {
    const filterSerialiser = jest.fn(() => 'filterSerialiser');

    expect(
      filtersSerialiser(
        {
          name: 'OPTION 1',
        },
        [
          {
            ...filtersWithIds[0],
            filterSerialiser,
          },
        ]
      )
    ).toEqual('filterSerialiser');

    expect(filterSerialiser).toHaveBeenCalled();
  });
});

describe('sortSerialiser', () => {
  const exampleColumns = [
    {
      title: 'Name',
      sortable: 'name',
    },
    {
      title: 'Description',
      sortable: 'description',
    },
  ];

  it('returns a string consumable by the Compliance API as a "sort_by" parameter', () => {
    expect(
      sortSerialiser(
        {
          index: 0,
          direction: 'asc',
        },
        exampleColumns
      )
    ).toEqual('name:asc');

    expect(
      sortSerialiser(
        {
          index: 1,
          direction: 'desc',
        },
        exampleColumns
      )
    ).toEqual('description:desc');
  });
});
