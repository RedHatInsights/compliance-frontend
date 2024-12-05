import items from '../../__fixtures__/items';
import columns from '../../__fixtures__/columns';

import { csvForItems, exportableColumns, jsonForItems } from './helpers';

const exampleItems = items(25);

const filteredColumns = exportableColumns(columns);

describe('jsonForItems', () => {
  it('returns an json export of items', () => {
    const result = jsonForItems({
      columns: filteredColumns,
      items: exampleItems,
    });

    expect(result).toMatchSnapshot();
  });
});

describe('csvForItems', () => {
  it('returns an csv export of items', () => {
    const result = csvForItems({
      columns: filteredColumns,
      items: exampleItems,
    });

    expect(result).toMatchSnapshot();
  });
});
