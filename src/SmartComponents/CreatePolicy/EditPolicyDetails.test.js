import { policyFormValues } from './fixtures.js';
import renderer from 'react-test-renderer';

jest.mock('redux-form', () => ({
    Field: 'Field',
    reduxForm: () => component => component,
    formValueSelector: () => () => ('')
}));

jest.mock('@redhat-cloud-services/frontend-components-inventory-compliance', () => {
    const ComplianceRemediationButton = () => <button>Remediations</button>;
    return ComplianceRemediationButton;
});

import { EditPolicyDetails } from './EditPolicyDetails.js';

describe('EditPolicyDetails', () => {
    it('expect to render without error', () => {
        const component = renderer.create(
            <EditPolicyDetails profile={JSON.parse(policyFormValues.profile)}/>
        );
        expect(component.toJSON()).toMatchSnapshot();
    });
});
