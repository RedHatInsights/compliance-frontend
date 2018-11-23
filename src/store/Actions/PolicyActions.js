import * as ActionTypes from '../ActionTypes';
import * as ComplianceBackendAPI from '../../Utilities/ComplianceBackend/ComplianceBackendAPI';

export const fetchPolicies = apiProps => ({
    type: ActionTypes.FETCH_COMPLIANCE_POLICIES,
    payload: new Promise(resolve => {
        resolve(ComplianceBackendAPI.get('/profiles', apiProps));
    })
});

export const fetchPolicyDetails = (policyId, apiProps) => ({
    type: ActionTypes.FETCH_COMPLIANCE_POLICY_DETAILS,
    payload: new Promise(resolve => {
        resolve(ComplianceBackendAPI.get('/profiles/' + policyId, apiProps));
    })
});
