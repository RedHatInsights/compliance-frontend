import * as ActionTypes from '../ActionTypes';
import * as ComplianceBackendAPI from '../../Utilities/ComplianceBackend/ComplianceBackendAPI';

export const fetchSystems = (searchQuery, apiProps) => ({
    type: ActionTypes.FETCH_COMPLIANCE_SYSTEMS,
    payload: new Promise(resolve => {
        resolve(ComplianceBackendAPI.get('/systems?' + searchQuery, apiProps));
    })
});
