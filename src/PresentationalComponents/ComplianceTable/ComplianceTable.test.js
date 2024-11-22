import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import items from 'Utilities/hooks/useTableTools/__fixtures__/items';
import columns from 'Utilities/hooks/useTableTools/__fixtures__/columns';

import TableStateProvider from '@/Frameworks/AsyncTableTools/components/TableStateProvider';
import ComplianceTable from './ComplianceTable';
import useAPIV2FeatureFlag from '../../Utilities/hooks/useAPIV2FeatureFlag';

jest.mock('../../Utilities/hooks/useAPIV2FeatureFlag');

describe.each([true, false])(
  'ComplianceTable with useAPIV2FeatureFlag set to %s',
  (featureFlagValue) => {
    beforeEach(() => {
      useAPIV2FeatureFlag.mockImplementation(() => featureFlagValue);
    });

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
  }
);
