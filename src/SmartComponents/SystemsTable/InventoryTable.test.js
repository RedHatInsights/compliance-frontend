import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { init } from 'Store';
import { InventoryTable } from './InventoryTable';
import { InventoryTable as FECInventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
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

import useFeature from 'Utilities/hooks/useFeature';
jest.mock('Utilities/hooks/useFeature');

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
FECInventoryTable.mockImplementation((props) => (
  <InventoryTableMock {...props} />
));

describe('InventoryTable', () => {
  const store = init().getStore();

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

  describe('via @testing-library/react', () => {
    beforeEach(() => {
      useFeature.mockImplementation((feature) => feature === 'tags');
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
          <InventoryTable {...{ emptyStateComponent }} />
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
