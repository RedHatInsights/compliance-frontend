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

expect.extend(filterHelpers);

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: () => 'Mocked Link',
}));

const profiles = rawPolicies.edges.map((profile) => profile.node);

describe('ReportsTable', () => {
  it('expect to render without error', () => {
    const wrapper = shallow(<ReportsTable profiles={profiles} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('expect to have filters properly rendered', () => {
    const policyTypes = uniq(
      profiles.map(({ policyType }) => policyType).filter((i) => !!i)
    );
    const operatingSystems = uniq(
      profiles.map(({ majorOsVersion }) => majorOsVersion).filter((i) => !!i)
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
