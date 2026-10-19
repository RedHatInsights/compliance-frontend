import React, { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
import TestWrapper from '@/Utilities/TestWrapper';
import IopInventoryTable from './IopInventoryTable';

jest.mock('@redhat-cloud-services/frontend-components/AsyncComponent', () =>
  jest.fn(() => <div>Async inventory</div>),
);

describe('IopInventoryTable', () => {
  it('loads the IoP inventory remote with chromeless context', () => {
    const ref = createRef();

    render(
      <TestWrapper>
        <IopInventoryTable
          ref={ref}
          showTags={false}
          tableProps={{ isStickyHeader: true, envContext: { custom: true } }}
        />
      </TestWrapper>,
    );

    expect(screen.getByText('Async inventory')).toBeInTheDocument();
    expect(AsyncComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        scope: 'inventory',
        module: './IOPInventoryTable',
        showTags: false,
        innerRef: ref,
        store: expect.objectContaining({
          dispatch: expect.any(Function),
          getState: expect.any(Function),
        }),
        tableProps: {
          isStickyHeader: true,
          envContext: {
            custom: true,
            loadChromeless: true,
          },
        },
      }),
      expect.anything(),
    );
  });
});
