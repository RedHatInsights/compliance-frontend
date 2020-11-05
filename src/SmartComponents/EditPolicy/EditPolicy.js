import React, { useState, useEffect } from 'react';
import propTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Form, Modal, Tab, TabTitleText } from '@patternfly/react-core';
import { RoutedTabs } from 'PresentationalComponents';
import { InventoryTable } from 'SmartComponents';
import { useLinkToBackground, useAnchor } from 'Utilities/Router';
import { useTitleEntity } from 'Utilities/hooks/useDocumentTitle';
import EditPolicyDetailsTab from './EditPolicyDetailsTab';
import usePolicyUpdate from './usePolicyUpdate';

export const EditPolicy = ({ route }) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const policy = location?.state?.policy;
    const anchor = useAnchor();
    const [updatedPolicy, setUpdatedPolicy] = useState(null);
    const updatePolicy = usePolicyUpdate();
    const linkToBackground = useLinkToBackground('/scappolicies');
    const selectedEntities = useSelector((state) => (state?.entities?.selectedEntities));
    const saveEnabled = updatedPolicy && !updatedPolicy.complianceThresholdValid;

    const linkToBackgroundWithHash = () => {
        dispatch({
            type: 'SELECT_ENTITIES',
            payload: { ids: [] }
        });
        linkToBackground({ hash: anchor });
    };

    const actions = [
        <Button
            isDisabled={ saveEnabled }
            key='save'
            variant='primary'
            onClick={ () => (
                updatePolicy(policy, updatedPolicy).then(() => linkToBackgroundWithHash())
            ) }>
            Save
        </Button>,
        <Button
            key='cancel'
            variant='secondary'
            onClick={ () => linkToBackgroundWithHash() }>
            Cancel
        </Button>
    ];

    useEffect(() => {
        setUpdatedPolicy({
            ...updatedPolicy,
            hosts: selectedEntities ? selectedEntities : []
        });
    }, [selectedEntities]);

    useEffect(() => {
        const complianceThresholdValid =
            (policy.complianceThreshold < 101 && policy.complianceThreshold > 0);
        setUpdatedPolicy({
            ...policy,
            complianceThresholdValid
        });
        dispatch({
            type: 'SELECT_ENTITIES',
            payload: { ids: policy?.hosts?.map(({ id }) => ({ id })) || [] }
        });
    }, [policy]);

    useTitleEntity(route, policy?.name);

    return policy && <Modal
        isOpen
        style={ { height: '400px' } }
        width={ 1000 }
        title={ `Edit ${policy.name }` }
        onClose={ () => linkToBackgroundWithHash() }
        actions={ actions }>
        <Form>
            <RoutedTabs defaultTab='details'>
                <Tab eventKey='details' title={<TabTitleText>Details</TabTitleText>}>
                    <EditPolicyDetailsTab
                        policy={ policy }
                        setUpdatedPolicy={ setUpdatedPolicy } />
                </Tab>

                <Tab eventKey='rules' title={ <TabTitleText>Rules</TabTitleText> }>
                    Rule editing coming soon
                </Tab>

                <Tab eventKey='systems' title={ <TabTitleText>Systems</TabTitleText> }>
                    <InventoryTable
                        compact
                        showActions={ false }
                        enableExport={ false }
                        showAllSystems
                        remediationsEnabled={ false }
                        policyId={ policy.id }
                        defaultFilter={`policy_id = ${policy.id}`}
                        columns={[{
                            key: 'display_name',
                            title: 'System name',
                            props: {
                                width: 40, isStatic: true
                            }
                        }]}
                        preselectedSystems={ policy?.hosts.map((h) => ({ id: h.id })) || [] } />
                </Tab>
            </RoutedTabs>
        </Form>
    </Modal>;
};

EditPolicy.propTypes = {
    route: propTypes.object
};

export default EditPolicy;
