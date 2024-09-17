import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestWrapper from '@/Utilities/TestWrapper';

import { policies as rawPolicies } from '@/__fixtures__/policies.js';
import ReportsTable from './ReportsTable';
import {
  policyNameFilter,
  policyTypeFilter,
  operatingSystemFilter,
  policyComplianceFilter,
} from './Filters';
import { uniq } from 'Utilities/helpers';
import { filterHelpers } from 'Utilities/hooks/useTableTools/testHelpers.js';
import useAPIV2FeatureFlag from '../../Utilities/hooks/useAPIV2FeatureFlag';

jest.mock('../../Utilities/hooks/useAPIV2FeatureFlag');

expect.extend(filterHelpers);

const profiles = rawPolicies.edges.map((profile) => profile.node);

describe('ReportsTable', () => {
  beforeEach(() => {
    useAPIV2FeatureFlag.mockImplementation(() => false);
  });
  it('expect to render without error', () => {
    render(
      <TestWrapper>
        <ReportsTable reports={profiles} />
      </TestWrapper>
    );

    expect(
      screen.getByRole('link', { name: 'C2S for Red Hat Enterprise Linux 7' })
    ).toBeInTheDocument();
  });

  // TODO This can be properly implemented once on react 18 and newer RTL packages
  it.skip('expect to have filters properly rendered', () => {
    const policyTypes = uniq(
      profiles.map(({ policyType }) => policyType).filter((i) => !!i)
    );
    const operatingSystems = uniq(
      profiles.map(({ osMajorVersion }) => osMajorVersion).filter((i) => !!i)
    );
    const component = <ReportsTable profiles={profiles} />;

    expect(component).toHaveFiltersFor([
      ...policyNameFilter,
      ...policyComplianceFilter,
      ...policyTypeFilter(policyTypes),
      ...operatingSystemFilter(operatingSystems),
    ]);
  });
});
