import React, { useState } from 'react';
import propTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import { Button, Modal, Spinner } from '@patternfly/react-core';
import { useLinkToBackground, useAnchor } from 'Utilities/Router';
import { useTitleEntity } from 'Utilities/hooks/useDocumentTitle';
import { StateViewWithError, StateViewPart } from 'PresentationalComponents';
import EditPolicyForm from './EditPolicyForm';
import { usePolicy } from 'Mutations';

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
    const anchor = useAnchor();
    const [updatedPolicy, setUpdatedPolicy] = useState(null);
    const [selectedRuleRefIds, setSelectedRuleRefIds] = useState([]);
    const [selectedHosts, setSelectedHosts] = useState();
    const updatePolicy = usePolicy();
    const linkToBackground = useLinkToBackground('/scappolicies');
    const [isSaving, setIsSaving] = useState();
    const saveEnabled = updatedPolicy && !updatedPolicy.complianceThresholdValid;

    const linkToBackgroundWithHash = () => {
        linkToBackground({ hash: anchor });
    };

    const onSave = () => {
        if (isSaving) { return; }

        setIsSaving(true);
        const updatedPolicyHostsAndRules = {
            ...updatedPolicy,
            selectedRuleRefIds,
            hosts: selectedHosts
        };
        updatePolicy(policy, updatedPolicyHostsAndRules).then(() => {
            setIsSaving(false);
            linkToBackgroundWithHash();
        }).catch(() => {
            // TODO report error
            setIsSaving(false);
            linkToBackgroundWithHash();
        });
    };

    const actions = [
        <Button
            isDisabled={ saveEnabled }
            key='save'
            variant='primary'
            spinnerAriaValueText='Saving'
            isLoading={ isSaving }
            onClick={ onSave }>
            Save
        </Button>,
        <Button
            key='cancel'
            variant='link'
            onClick={ () => linkToBackgroundWithHash() }>
            Cancel
        </Button>
    ];

    useTitleEntity(route, policy?.name);

    return <Modal
        isOpen
        position={ 'top' }
        style={ { minHeight: '350px' } }
        variant={ 'large' }
        title={ `Edit ${ policy ? policy.name : '' }` }
        onClose={ () => linkToBackgroundWithHash() }
        actions={ actions }>

        <StateViewWithError stateValues={ { policy, loading, error } }>
            <StateViewPart stateKey="loading">
                <Spinner />
            </StateViewPart>
            <StateViewPart stateKey="policy">
                <EditPolicyForm
                    { ...{
                        policy, updatedPolicy, setUpdatedPolicy,
                        selectedRuleRefIds, setSelectedRuleRefIds, setSelectedHosts
                    } } />
            </StateViewPart>
        </StateViewWithError>
    </Modal>;
};

EditPolicy.propTypes = {
    route: propTypes.object
};

export default EditPolicy;
