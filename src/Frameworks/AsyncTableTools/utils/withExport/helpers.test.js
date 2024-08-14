import items from '../../../../Utilities/hooks/useTableTools/__fixtures__/items';
import columns from '../../../../Utilities/hooks/useTableTools/__fixtures__/columns';

import { csvForItems, jsonForItems } from './helpers';

const exampleItems = items(25);

describe('jsonForItems', () => {
  it('returns an json export of items', () => {
    const result = jsonForItems({
      columns,
      items: exampleItems,
    });

    expect(result).toMatchSnapshot();
  });
});

describe('csvForItems', () => {
  it('returns an csv export of items', () => {
    const result = csvForItems({
      columns,
      items: exampleItems,
    });

    expect(result).toMatchSnapshot();
  });
});
