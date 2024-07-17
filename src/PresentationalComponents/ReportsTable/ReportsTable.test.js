import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestWrapper from '@/Utilities/TestWrapper';

import { reports } from '@/__fixtures__/reports.js';
import ReportsTable from './ReportsTable';
import {
  policyNameFilter,
  policyTypeFilter,
  operatingSystemFilter,
  policyComplianceFilter,
} from './Filters';
import { uniq } from 'Utilities/helpers';
import { filterHelpers } from 'Utilities/hooks/useTableTools/testHelpers.js';

expect.extend(filterHelpers);

describe('ReportsTable', () => {
  it('expect to render without error', () => {
    render(
      <TestWrapper>
        <ReportsTable profiles={reports} />
      </TestWrapper>
    );

    expect(
      screen.getByRole('link', { name: 'C2S for Red Hat Enterprise Linux 7' })
    ).toBeInTheDocument();
  });

  // TODO This can be properly implemented once on react 18 and newer RTL packages
  it.skip('expect to have filters properly rendered', () => {
    const policyTypes = uniq(
      reports.map(({ policyType }) => policyType).filter((i) => !!i)
    );
    const operatingSystems = uniq(
      reports.map(({ osMajorVersion }) => osMajorVersion).filter((i) => !!i)
    );
    const component = <ReportsTable profiles={reports} />;

    expect(component).toHaveFiltersFor([
      ...policyNameFilter,
      ...policyComplianceFilter,
      ...policyTypeFilter(policyTypes),
      ...operatingSystemFilter(operatingSystems),
    ]);
  });
});
