import React, { useState } from 'react';
import propTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import { Button, Modal, Spinner } from '@patternfly/react-core';
import { useLinkToBackground, useAnchor } from 'Utilities/Router';
import { useTitleEntity } from 'Utilities/hooks/useDocumentTitle';
import EditPolicyForm from './EditPolicyForm';
import usePolicy from './usePolicy';

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
    let { data } = useQuery(MULTIVERSION_QUERY, {
        variables: { policyId }
    });
    const policy = data?.profile;
    const dispatch = useDispatch();
    const anchor = useAnchor();
    const [updatedPolicy, setUpdatedPolicy] = useState(null);
    const updatePolicy = usePolicy();
    const linkToBackground = useLinkToBackground('/scappolicies');
    const [isSaving, setIsSaving] = useState();
    const saveEnabled = updatedPolicy && !updatedPolicy.complianceThresholdValid;

    const linkToBackgroundWithHash = () => {
        dispatch({
            type: 'SELECT_ENTITIES',
            payload: { ids: [] }
        });
        linkToBackground({ hash: anchor });
    };

    const onSave = () => {
        if (isSaving) { return; }

        setIsSaving(true);
        updatePolicy(policy, updatedPolicy).then(() => {
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
        style={ { height: '768px' } }
        width={ 1220 }
        title={ `Edit ${ policy ? policy.name : '' }` }
        onClose={ () => linkToBackgroundWithHash() }
        actions={ actions }>
        { policy
            ? <EditPolicyForm { ...{ policy, updatedPolicy, setUpdatedPolicy } } />
            : <Spinner /> }
    </Modal>;
};

EditPolicy.propTypes = {
    route: propTypes.object
};

export default EditPolicy;
