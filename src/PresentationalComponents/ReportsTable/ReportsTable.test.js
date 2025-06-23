import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestWrapper from '@/Utilities/TestWrapper';
import userEvent from '@testing-library/user-event';

import ReportsTable from './ReportsTable';
import {
  policyNameFilter,
  operatingSystemFilter,
  policyComplianceFilter,
} from './Filters';
import { uniq } from 'Utilities/helpers';
import { buildReports } from '../../__factories__/reports';
// import useFeatureFlag from 'Utilities/hooks/useFeatureFlag';

jest.mock('Utilities/hooks/useFeatureFlag', () => () => false);

const reportsData = buildReports(1);

describe('ReportsTable', () => {
  it('expect to render without error', () => {
    render(
      <TestWrapper>
        <ReportsTable reports={reportsData} />
      </TestWrapper>,
    );

    expect(
      screen.getByRole('link', { name: reportsData[0].title }),
    ).toBeInTheDocument();
  });

  it('expect to have filters properly rendered', async () => {
    const operatingSystems = uniq(
      reportsData
        .map(({ os_major_version }) => os_major_version)
        .filter((i) => !!i),
    );
    const nameLabel = policyNameFilter[0].label;
    const operatingSystemLabel =
      operatingSystemFilter(operatingSystems)[0].label;
    const complianceLabel = policyComplianceFilter[0].label;

    render(
      <TestWrapper>
        <ReportsTable
          reports={reportsData}
          operatingSystems={operatingSystems}
        />
      </TestWrapper>,
    );

    const toggleButton = screen.getByRole('button', {
      name: 'Conditional filter toggle',
    });
    expect(toggleButton).toHaveTextContent(nameLabel);

    const nonDefaultfiltersToCheck = [operatingSystemLabel, complianceLabel];
    nonDefaultfiltersToCheck.forEach(async (filterLabel) => {
      await userEvent.click(toggleButton);
      const filterList = await screen.findByRole('menu', {
        name: 'Conditional filters list',
      });
      expect(filterList).toBeInTheDocument();

      const osFilterItem = within(filterList).getByText(filterLabel);
      expect(osFilterItem).toBeInTheDocument();
      await userEvent.click(osFilterItem);

      expect(toggleButton).toHaveTextContent(operatingSystemLabel);
    });
  });
});
