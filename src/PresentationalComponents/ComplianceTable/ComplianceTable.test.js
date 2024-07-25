import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import items from 'Utilities/hooks/useTableTools/__fixtures__/items';
import columns from 'Utilities/hooks/useTableTools/__fixtures__/columns';

import TableStateProvider from '@/Frameworks/AsyncTableTools/components/TableStateProvider';
import ComplianceTable from './ComplianceTable';

describe('ComplianceTable', () => {
  const exampleItems = items(30).sort((item) => item.name);
  const defaultProps = {
    columns,
    items: exampleItems,
    'aria-label': 'Test Table',
  };

  it('expect to render', () => {
    render(
      <TableStateProvider>
        <ComplianceTable {...defaultProps} />
      </TableStateProvider>
    );

    expect(screen.getByLabelText('Test Table')).toBeInTheDocument();
  });
});
