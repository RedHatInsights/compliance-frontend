import { useLocation } from 'react-router-dom';
import { EditPolicy, MULTIVERSION_QUERY } from './EditPolicy.js';
jest.mock('Mutations');
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(() => ({})),
    useDispatch: jest.fn(() => ({}))
}));
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn().mockReturnValue({ policy_id: '1' }), // eslint-disable-line
    useLocation: jest.fn(),
    useHistory: jest.fn(() => ({}))
}));
jest.mock('Utilities/hooks/useDocumentTitle', () => ({
    useTitleEntity: () => ({}),
    setTitle: () => ({})
}));

const mocks = [
    {
        request: {
            query: MULTIVERSION_QUERY,
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
jest.mock('@apollo/client', () => ({
    useQuery: () => (
        { data: mocks[0].result.data, error: undefined, loading: undefined }
    )
}));

describe('EditPolicy', () => {

    const defaultProps = {
        onClose: jest.fn(),
        dispatch: jest.fn(),
        change: jest.fn()
    };

    beforeEach(() => {
        useLocation.mockImplementation(() => ({
            hash: '#details',
            state: {
                policy: {
                    id: 'POLICY_ID',
                    name: 'Policy Name',
                    majorOsVersion: '8',
                    businessObjective: {
                        title: 'BO title',
                        id: 1
                    },
                    complianceThreshold: '30',
                    hosts: []
                }
            }
        }));
    });

    it('expect to render without error', () => {
        const wrapper = shallow(
            <EditPolicy { ...defaultProps }/>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
