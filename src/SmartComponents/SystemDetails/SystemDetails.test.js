import toJson from 'enzyme-to-json';
import { useQuery } from '@apollo/react-hooks';

import { SystemDetails } from './SystemDetails.js';

jest.mock('react-router-dom', () => ({
    ...require.requireActual('react-router-dom'),
    useHistory: jest.fn(),
    useLocation: jest.fn(() => ({
        query: {
            hidePassed: false
        }
    }))
}));

jest.mock('SmartComponents', () => ({
    InventoryDetails: () => 'Details'
}));
jest.mock('@apollo/react-hooks');

jest.mock('@redhat-cloud-services/frontend-components-inventory-compliance', () =>
    () => 'Mocked ComplianceSystemDetails'
);

describe('SystemDetails', () => {
    const defaultProps = {
        exportToCSV: jest.fn(),
        selectedEntities: [1, 2, 3],
        match: {
            params: {
                inventoryId: 1
            }
        }
    };
    it('expect to render loading', () => {
        useQuery.mockImplementation(() => ({ data: {}, error: false, loading: true }));
        const wrapper = shallow(
            <SystemDetails { ...defaultProps }/>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render without error', () => {
        useQuery.mockImplementation(() => ({
            data: {
                system: {
                    name: 'test.host.local'
                }
            }, error: false, loading: false }));

        const wrapper = shallow(
            <SystemDetails { ...defaultProps }/>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render an error', () => {
        const error = {
            networkError: { statusCode: 500 },
            error: 'Test Error loading'
        };
        useQuery.mockImplementation(() => ({ data: {}, error, loading: false }));
        const wrapper = shallow(
            <SystemDetails { ...defaultProps }/>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render an error', () => {
        window.insights = {
            chrome: { auth: { logout: jest.fn(() => 'Logout') } }
        };
        const error = {
            networkError: { statusCode: 401 },
            error: 'Test Error loading'
        };
        useQuery.mockImplementation(() => ({ data: {}, error, loading: false }));
        const wrapper = shallow(
            <SystemDetails { ...defaultProps }/>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
        expect(window.insights.chrome.auth.logout).toHaveBeenCalled();
    });

});
