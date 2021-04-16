import { useQuery } from '@apollo/client';
import { profiles } from '@/__fixtures__/profiles.js';

jest.mock('@apollo/client');
jest.mock('react-router-dom');

window.insights = {
    chrome: { isBeta: jest.fn(() => true) }
};

import { CompliancePolicies } from './CompliancePolicies.js';

window.insights = {
    chrome: { isBeta: jest.fn(() => true) }
};

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(() => ({}))
}));

describe('CompliancePolicies', () => {
    it('expect to render without error', () => {
        useQuery.mockImplementation(() => ({
            data: {
                profiles: {
                    edges: [{
                        id: '1',
                        refId: '121212',
                        name: 'profile1',
                        complianceThreshold: 90.0,
                        businessObjective: {
                            id: '1',
                            title: 'BO 1'
                        }
                    }]
                }
            }, error: undefined, loading: undefined }));

        const wrapper = shallow(
            <CompliancePolicies />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render emptystate', () => {
        useQuery.mockImplementation(() => ({
            data: {
                profiles: {
                    edges: []
                }
            }, error: undefined, loading: undefined }));

        const wrapper = shallow(
            <CompliancePolicies />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render an error', () => {
        const error = {
            networkError: { statusCode: 500 },
            error: 'Test Error loading'
        };
        useQuery.mockImplementation(() => ({ data: undefined, error, loading: undefined }));
        const wrapper = shallow(
            <CompliancePolicies />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render loading', () => {
        useQuery.mockImplementation(() => ({ data: undefined, error: undefined, loading: true }));
        const wrapper = shallow(
            <CompliancePolicies />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render a policies table', () => {
        useQuery.mockImplementation(() => ({ data: profiles, error: undefined, loading: undefined }));
        const wrapper = shallow(
            <CompliancePolicies />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
