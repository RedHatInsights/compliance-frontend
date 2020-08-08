import React from 'react';
import {
    QUERY,
    PolicyDetails
} from './PolicyDetails';

const mocks = [
    {
        request: {
            query: QUERY,
            variables: {
                policyId: '1234'
            }
        },
        result: {
            data: {
                profile: {
                    id: '1',
                    refId: '121212',
                    name: 'profile1',
                    description: 'profile description',
                    totalHostCount: 1,
                    complianceThreshold: 1,
                    compliantHostCount: 1,
                    policy: {
                        name: 'parentpolicy'
                    },
                    businessObjective: {
                        id: '1',
                        title: 'BO 1'
                    },
                    benchmark: {
                        title: 'benchmark',
                        version: '0.1.5'
                    }
                }
            }
        }
    }
];

jest.mock('@apollo/react-hooks', () => ({
    useQuery: () => (
        { data: mocks[0].result.data, error: undefined, loading: undefined }
    )
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn().mockReturnValue({ policy_id: '1' }) // eslint-disable-line
}));

describe('PolicyDetails', () => {
    it('expect to render without error', () => {
        const wrapper = shallow(<PolicyDetails />);

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
