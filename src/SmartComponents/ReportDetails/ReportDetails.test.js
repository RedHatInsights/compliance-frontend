import { init } from '../../store';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';

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
        }
    }
];
const store = init().getStore();

jest.mock('@redhat-cloud-services/frontend-components-inventory-compliance', () => {
    const ComplianceRemediationButton = () => <button>Remediations</button>;
    return ComplianceRemediationButton;
});

jest.mock('../SystemsTable/SystemsTable', () => {
    const SystemsTable = () => <table><tr><td>Systems Table</td></tr></table>;
    return SystemsTable;
});

jest.mock('../EditPolicy/EditPolicy', () => {
    const EditPolicy = () => <div>Edit Policy</div>;
    return EditPolicy;
});

// Currently there seems to be an issue in react-apollo, which causes it not to recognize a MockProvider
// This is a hack and should eventually be replaced by using a MockProvider provided by react-apollo's test utilities
jest.mock('@apollo/react-hooks', () => ({
    useQuery: () => {
        return { data: mocks[0].result.data, error: false, loading: false };
    }
}));

describe('ReportDetails', () => {
    const defaultProps = {
        match: {
            params: {
                policyId: '123'
            }
        }
    };

    it('expect to render without error', () => {
        global.insights = {};
        const component = renderer.create(
            <Router>
                <Provider store={ store }>
                    <ReportDetails { ...defaultProps } />
                </Provider>
            </Router>
        );

        expect(component).toMatchSnapshot();
    });
});
