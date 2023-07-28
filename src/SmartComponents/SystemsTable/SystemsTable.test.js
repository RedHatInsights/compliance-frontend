import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { init } from 'Store';
import { SystemsTable } from './SystemsTable';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import {
  DEFAULT_SYSTEMS_FILTER_CONFIGURATION,
  COMPLIANT_SYSTEMS_FILTER_CONFIGURATION,
} from '@/constants';
import {
  useGetEntities,
  useOsMinorVersionFilter,
  useFetchSystems,
} from './hooks';
import { filterHelpers } from 'Utilities/hooks/useTableTools/testHelpers';
expect.extend(filterHelpers);

import { osMinorVersionFilter as mockOsMinorVersionFilter } from './__mocks__/osMinorVersionFilter';
import InventoryTableMock from './__mocks__/InventoryTableMock';
import useFetchSystemsMockBuilder from './__mocks__/useFetchSystemsMockBuilder';

jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  useApolloClient: () => jest.fn(),
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
}));

jest.mock('./hooks', () => ({
  ...jest.requireActual('./hooks'),
  useGetEntities: jest.fn(),
  useFetchSystems: jest.fn(),
  useOsMinorVersionFilter: jest.fn(),
}));
useFetchSystems.mockImplementation(useFetchSystemsMockBuilder());
useGetEntities.mockImplementation(
  (fetchSystems) => async () => await fetchSystems()
);
useOsMinorVersionFilter.mockImplementation(() => mockOsMinorVersionFilter);

jest.mock('@redhat-cloud-services/frontend-components/Inventory', () => ({
  ...jest.requireActual('@redhat-cloud-services/frontend-components/Inventory'),
  InventoryTable: jest.fn(),
}));
InventoryTable.mockImplementation((props) => <InventoryTableMock {...props} />);

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('SystemsTable', () => {
  const store = init().getStore();

  it('returns', () => {
    expect(renderJson(<SystemsTable />)).toMatchSnapshot();
  });

  it('returns without actions', () => {
    expect(renderJson(<SystemsTable showActions={false} />)).toMatchSnapshot();
  });

  it('returns without remediations', () => {
    expect(
      renderJson(<SystemsTable remediationsEnabled={false} />)
    ).toMatchSnapshot();
  });

  it('returns showAllSystems', () => {
    expect(renderJson(<SystemsTable showAllSystems />)).toMatchSnapshot();
  });

  it('returns with a showComplianceSystemsInfo', () => {
    expect(
      renderJson(<SystemsTable showComplianceSystemsInfo />)
    ).toMatchSnapshot();
  });

  it('returns compact', () => {
    expect(renderJson(<SystemsTable compact />)).toMatchSnapshot();
  });

  it('returns with compliantFilter', () => {
    expect(renderJson(<SystemsTable compliantFilter />)).toMatchSnapshot();
  });

  it('returns with showOnlySystemsWithTestResults', () => {
    expect(
      renderJson(<SystemsTable showOnlySystemsWithTestResults />)
    ).toMatchSnapshot();
  });

  it('expect to have filters properly rendered', () => {
    const component = (
      <Provider store={store}>
        <SystemsTable
          showOsMinorVersionFilter
          compliantFilter
          remediationsEnabled={false}
          ruleSeverityFilter
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

  describe('via @testing-library/react', () => {
    beforeEach(() => {
      window.insights = {
        chrome: {
          getUserPermissions: () => Promise.resolve([]),
        },
        experimental: {
          loadRemediations: () => Promise.resolve([]),
        },
      };
    });

    describe('emptyStateComponent', function () {
      const emptyStateComponent = <div>Empty State</div>;
      const component = (
        <Provider store={store}>
          <SystemsTable {...{ emptyStateComponent }} />
        </Provider>
      );

      it('should show an emptystate when there are no results', () => {
        useFetchSystems.mockImplementation(
          useFetchSystemsMockBuilder({
            entities: [],
            meta: {
              tags: [],
              totalCount: 0,
            },
          })
        );

        const { container } = render(component);
        expect(container).toMatchSnapshot();
      });

      it('should show NO emptystate when tags queries return no results', () => {
        useFetchSystems.mockImplementation(
          useFetchSystemsMockBuilder({
            entities: [],
            meta: {
              tags: ['tag1'],
              totalCount: 0,
            },
          })
        );
        const { container } = render(component);
        expect(container).toMatchSnapshot();
      });
    });
  });
});
