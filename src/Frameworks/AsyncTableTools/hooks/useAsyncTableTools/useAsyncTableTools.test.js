import { renderHook } from '@testing-library/react';
import { DEFAULT_RENDER_OPTIONS } from '../../utils/testHelpers';
import items from 'Utilities/hooks/useTableTools/__fixtures__/items';
import columns from 'Utilities/hooks/useTableTools/__fixtures__/columns';

import useAsyncTableTools from './useAsyncTableTools';

describe('useAsyncTableTools', () => {
  const exampleItems = items(30).sort((item) => item.name);

  const defaultArguments = [exampleItems, columns, {}];

  it('returns a object with tableProps and toolbarProps', () => {
    const { result } = renderHook(
      () => useAsyncTableTools(...defaultArguments),
      DEFAULT_RENDER_OPTIONS
    );

    expect(result.current.tableProps).toBeDefined();
    expect(result.current.toolbarProps).toBeDefined();
  });
});
