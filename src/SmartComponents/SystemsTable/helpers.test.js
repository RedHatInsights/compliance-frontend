import { filterColumnsByInventoryFeatures } from './helpers';
import * as Columns from './Columns';

describe('filterColumnsByInventoryFeatures', () => {
  const osColumn = Columns.OS;
  const columns = [Columns.Name, Columns.Workspaces, Columns.Tags, osColumn];

  it('keeps Workspaces and Tags when the feature is enabled', () => {
    expect(filterColumnsByInventoryFeatures(columns, true)).toEqual(columns);
  });

  it('removes Workspaces and Tags when the feature is disabled', () => {
    expect(filterColumnsByInventoryFeatures(columns, false)).toEqual([
      Columns.Name,
      osColumn,
    ]);
  });
});
