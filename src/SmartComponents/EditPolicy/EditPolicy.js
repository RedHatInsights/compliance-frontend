import React, { useState } from 'react';
import propTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import { Button, Modal, Spinner } from '@patternfly/react-core';
import { useTitleEntity } from 'Utilities/hooks/useDocumentTitle';
import { StateViewWithError, StateViewPart } from 'PresentationalComponents';
import EditPolicyForm from './EditPolicyForm';
import { useOnSave, useLinkToPolicy } from './hooks';

export const MULTIVERSION_QUERY = gql`
query Profile($policyId: String!){
    profile(id: $policyId) {
        id
        name
        refId
        external
        description
        totalHostCount
        compliantHostCount
        complianceThreshold
        majorOsVersion
        osMajorVersion
        lastScanned
        policyType
        policy {
            id
            name
            refId
            profiles {
                id
                ssgVersion
                parentProfileId
                name
                refId
                osMinorVersion
                osMajorVersion
                benchmark {
                    id
                    title
                    latestSupportedOsMinorVersions
                    osMajorVersion
                }
                rules {
                    title
                    severity
                    rationale
                    refId
                    description
                    remediationAvailable
                    identifier
                }
            }
        }
        businessObjective {
            id
            title
        }
        hosts {
            id
            osMinorVersion
            osMajorVersion
        }
    }
}
`;

export const EditPolicy = ({ route }) => {
    const { policy_id: policyId } = useParams();
    const { data, loading, error } = useQuery(MULTIVERSION_QUERY, {
        variables: { policyId }
    });
    const policy = data?.profile;
    const linkToPolicy = useLinkToPolicy();
    const [updatedPolicy, setUpdatedPolicy] = useState(null);
    const [selectedRuleRefIds, setSelectedRuleRefIds] = useState([]);
    const [selectedSystems, setSelectedSystems] = useState([]);
    const saveEnabled = updatedPolicy && !updatedPolicy.complianceThresholdValid;
    const updatedPolicyHostsAndRules = {
        ...updatedPolicy,
        selectedRuleRefIds,
        hosts: selectedSystems
    };
    const [isSaving, onSave] = useOnSave(policy, updatedPolicyHostsAndRules);

    const actions = [
        <Button
            isDisabled={ saveEnabled }
            key='save'
            ouiaId="EditPolicySaveButton"
            variant='primary'
            spinnerAriaValueText='Saving'
            isLoading={ isSaving }
            onClick={ onSave }>
            Save
        </Button>,
        <Button
            key='cancel'
            ouiaId="EditPolicyCancelButton"
            variant='link'
            onClick={ () => linkToPolicy() }>
            Cancel
        </Button>
    ];

    useTitleEntity(route, policy?.name);

    return <Modal
        isOpen
        position={ 'top' }
        style={ { minHeight: '350px' } }
        variant={ 'large' }
        ouiaId="EditPolicyModal"
        title={ `Edit ${ policy ? policy.name : '' }` }
        onClose={ () => linkToPolicy() }
        actions={ actions }>

        <StateViewWithError stateValues={ { policy, loading, error } }>
            <StateViewPart stateKey="loading">
                <Spinner />
            </StateViewPart>
            <StateViewPart stateKey="policy">
                <EditPolicyForm
                    { ...{
                        policy,
                        updatedPolicy,
                        setUpdatedPolicy,
                        selectedRuleRefIds,
                        setSelectedRuleRefIds,
                        selectedSystems,
                        setSelectedSystems
                    } } />
            </StateViewPart>
        </StateViewWithError>
    </Modal>;
};

EditPolicy.propTypes = {
    route: propTypes.object
};

export default EditPolicy;
