import { init } from 'Store';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import useFeature from 'Utilities/hooks/useFeature';
import { useQuery, useMutation } from '@apollo/react-hooks';

import {
    QUERY,
    ReportDetails
} from './ReportDetails';

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
                    policyType: 'policy type',
                    description: 'profile description',
                    external: false,
                    testResultHostCount: 10,
                    complianceThreshold: 1,
                    compliantHostCount: 5,
                    unsupportedHostCount: 5,
                    policy: {
                        id: 'thepolicyid',
                        name: 'the policy name'
                    },
                    businessObjective: {
                        id: '1',
                        title: 'BO 1'
                    },
                    benchmark: {
                        version: '0.1.4'
                    }
                }
            }
        }
    }
];
const store = init().getStore();

jest.mock('../SystemsTable/SystemsTable', () => {
    const SystemsTable = () => <table><tr><td>Systems Table</td></tr></table>;
    return SystemsTable;
});

// Currently there seems to be an issue in react-apollo, which causes it not to recognize a MockProvider
// This is a hack and should eventually be replaced by using a MockProvider provided by react-apollo's test utilities
jest.mock('@apollo/react-hooks');
jest.mock('Utilities/hooks/useFeature');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn().mockReturnValue({ policy_id: '1' }), // eslint-disable-line
}));

describe('ReportDetails', () => {
    const defaultProps = {
        match: {
            params: {
                policyId: '123'
            }
        }
    };

    beforeEach(() => {
        useFeature.mockImplementation(() => (false));
        useMutation.mockImplementation(() => ([() => {}]));
        useQuery.mockImplementation(() => ({ data: mocks[0].result.data, error: false, loading: false }));
        window.insights = {
            chrome: { isBeta: jest.fn(() => true) }
        };
    });

    it('expect to render without error', () => {
        const component = mount(
            <Router>
                <Provider store={ store }>
                    <ReportDetails { ...defaultProps } />
                </Provider>
            </Router>
        );

        expect(toJson(component)).toMatchSnapshot();
    });

    it('expect to render without error and ssg Version', () => {
        useFeature.mockImplementation(() => (true));
        const component = shallow(
            <ReportDetails { ...defaultProps } store={ store } />
        );

        expect(toJson(component)).toMatchSnapshot();
    });

    it('expect to render without ssg version for external profiles', () => {
        useFeature.mockImplementation(() => (true));
        const data = {
            profile: {
                ...mocks[0].result.data.profile,
                policy: null
            }
        };
        useQuery.mockImplementation(() => {
            return { data, error: false, loading: false };
        });
        const component = shallow(
            <ReportDetails { ...defaultProps } store={ store } />
        );

        expect(toJson(component)).toMatchSnapshot();
    });
});
