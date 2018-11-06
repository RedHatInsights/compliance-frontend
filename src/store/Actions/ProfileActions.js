import * as ActionTypes from '../ActionTypes';
import * as ComplianceBackendAPI from '../../Utilities/ComplianceBackend/ComplianceBackendAPI';

export const fetchProfiles = apiProps => ({
    type: ActionTypes.FETCH_COMPLIANCE_PROFILES,
    payload: new Promise(resolve => {
        resolve(ComplianceBackendAPI.getProfiles(apiProps));
    })
});
