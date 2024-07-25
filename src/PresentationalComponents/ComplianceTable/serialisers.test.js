import { stringToId } from '@/Frameworks/AsyncTableTools/hooks/useFilterConfig/helpers';
import filters from 'Utilities/hooks/useTableTools/__fixtures__/filters';

import { filtersSerialiser } from './serialisers';

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
      "name ~ 'testvalue'"
    );
  });

  it('should return a scoped search query for checkbox filters', () => {
    expect(
      filtersSerialiser(
        {
          'checkbox-filter': ['OPTION 1', 'OPTION 2'],
        },
        filtersWithIds
      )
    ).toEqual("checkbox IN ('OPTION 1', 'OPTION 2')");
  });

  it('should return a scoped search query for radio filters', () => {
    expect(
      filtersSerialiser(
        {
          'radio-filter': ['OPTION 1'],
        },
        filtersWithIds
      )
    ).toEqual("radio = 'OPTION 1'");
  });

  it('should return a scoped search query for multiple filters', () => {
    expect(
      filtersSerialiser(
        {
          'radio-filter': ['OPTION 1'],
          'checkbox-filter': ['OPTION 1', 'OPTION 2'],
        },
        filtersWithIds
      )
    ).toEqual("radio = 'OPTION 1' AND checkbox IN ('OPTION 1', 'OPTION 2')");
  });
});
