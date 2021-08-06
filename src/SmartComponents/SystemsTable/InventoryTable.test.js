import { Provider } from 'react-redux';
import { init } from 'Store';
import { Table } from '@patternfly/react-table';
import PrimaryToolbar from '@redhat-cloud-services/frontend-components/PrimaryToolbar';
import { InventoryTable } from './InventoryTable';
import {
  DEFAULT_SYSTEMS_FILTER_CONFIGURATION,
  COMPLIANT_SYSTEMS_FILTER_CONFIGURATION,
} from '@/constants';
import { osMinorVersionFilter as mockOsMinorVersionFilter } from './__mocks__/osMinorVersionFilter';
import { filterHelpers } from 'Utilities/hooks/useTableTools/testHelpers';
expect.extend(filterHelpers);

jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  useApolloClient: () => jest.fn(),
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
}));

const InventoryTableMock = (props) => (
  <div>
    <PrimaryToolbar {...props} />
    <Table aria-label="Mock inventory table" {...props} />
  </div>
);

jest.mock('@redhat-cloud-services/frontend-components/Inventory', () => ({
  ...jest.requireActual('@redhat-cloud-services/frontend-components/Inventory'),
  InventoryTable: InventoryTableMock,
}));

jest.mock('./hooks', () => ({
  ...jest.requireActual('./hooks'),
  useOsMinorVersionFilter: jest.fn(() => mockOsMinorVersionFilter),
}));

describe('InventoryTable', () => {
  it('returns', () => {
    expect(renderJson(<InventoryTable />)).toMatchSnapshot();
  });

  it('returns without actions', () => {
    expect(
      renderJson(<InventoryTable showActions={false} />)
    ).toMatchSnapshot();
  });

  it('returns without remediations', () => {
    expect(
      renderJson(<InventoryTable remediationsEnabled={false} />)
    ).toMatchSnapshot();
  });

  it('returns showAllSystems', () => {
    expect(renderJson(<InventoryTable showAllSystems />)).toMatchSnapshot();
  });

  it('returns with a showComplianceSystemsInfo', () => {
    expect(
      renderJson(<InventoryTable showComplianceSystemsInfo />)
    ).toMatchSnapshot();
  });

  it('returns compact', () => {
    expect(renderJson(<InventoryTable compact />)).toMatchSnapshot();
  });

  it('returns with compliantFilter', () => {
    expect(renderJson(<InventoryTable compliantFilter />)).toMatchSnapshot();
  });

  it('returns with showOnlySystemsWithTestResults', () => {
    expect(
      renderJson(<InventoryTable showOnlySystemsWithTestResults />)
    ).toMatchSnapshot();
  });

  it('expect to have filters properly rendered', () => {
    const store = init().getStore();
    const component = (
      <Provider store={store}>
        <InventoryTable
          showOsMinorVersionFilter
          compliantFilter
          remediationsEnabled={false}
        />
      </Provider>
    );

    expect(component).toHaveFiltersFor([
      ...DEFAULT_SYSTEMS_FILTER_CONFIGURATION,
      ...COMPLIANT_SYSTEMS_FILTER_CONFIGURATION,
      {
        type: 'group',
        label: 'Operating system',
        items: [
          {
            label: 'RHEL 7',
            value: 1,
            items: [{ label: 'RHEL 7.9', value: 1 }],
          },
        ],
      },
    ]);
  });
});
