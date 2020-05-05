import { useQuery } from '@apollo/react-hooks';

import { Reports } from './Reports.js';

jest.mock('@apollo/react-hooks');

describe('Reports', () => {
    it('expect to render without error', () => {
        useQuery.mockImplementation(() => ({
            data: {
                profiles: {
                    edges: [
                        {
                            node: {
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
                            }
                        }
                    ]
                }
            }, error: false, loading: false
        }));

        const wrapper = shallow(
            <Reports />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render emptystate', () => {
        useQuery.mockImplementation(() => ({
            data: {
                profiles: { edges: [] }
            }, error: false, loading: false }));

        const wrapper = shallow(
            <Reports />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render loading', () => {
        useQuery.mockImplementation(() => ({ data: undefined, error: false, loading: true }));
        const wrapper = shallow(
            <Reports />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

});
