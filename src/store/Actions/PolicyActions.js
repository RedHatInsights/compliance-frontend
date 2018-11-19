import * as ActionTypes from '../ActionTypes';
import * as ComplianceBackendAPI from '../../Utilities/ComplianceBackend/ComplianceBackendAPI';

export const fetchPolicies = apiProps => ({
    type: ActionTypes.FETCH_COMPLIANCE_POLICIES,
    payload: new Promise(resolve => {
        resolve(ComplianceBackendAPI.get('/profiles', apiProps));
    })
});
