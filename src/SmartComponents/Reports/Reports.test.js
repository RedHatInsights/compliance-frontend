import toJson from 'enzyme-to-json';
import { useQuery } from '@apollo/react-hooks';

import { Reports } from './Reports.js';

jest.mock('@apollo/react-hooks');

describe('Reports', () => {
    it('expect to render without error', () => {
        useQuery.mockImplementation(() => ({
            data: {
                allProfiles: [{
                    id: '1',
                    refId: '121212',
                    name: 'profile1',
                    description: 'profile description',
                    totalHostCount: 1,
                    complianceThreshold: 1,
                    compliantHostCount: 1,
                    businessObjective: {
                        id: '1',
                        title: 'BO 1'
                    }
                }]
            }, error: false, loading: false }));

        const wrapper = shallow(
            <Reports />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render emptystate', () => {
        useQuery.mockImplementation(() => ({
            data: {
                allProfiles: []
            }, error: false, loading: false }));

        const wrapper = shallow(
            <Reports />
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
            <Reports />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render loading', () => {
        useQuery.mockImplementation(() => ({ data: {}, error: false, loading: true }));
        const wrapper = shallow(
            <Reports />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

});
