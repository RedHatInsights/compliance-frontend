import React, { useState, useEffect } from 'react';
import propTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Form, Modal, Tab, TabTitleText } from '@patternfly/react-core';
import { RoutedTabs } from 'PresentationalComponents';
import { InventoryTable, SystemsTable } from 'SmartComponents';
import { useLinkToBackground, useAnchor } from 'Utilities/Router';
import { useTitleEntity } from 'Utilities/hooks/useDocumentTitle';
import EditPolicyDetailsTab from './EditPolicyDetailsTab';
import usePolicyUpdate from './usePolicyUpdate';
import useFeature from 'Utilities/hooks/useFeature';
import { systemName } from 'Store/Reducers/SystemStore';
import { GET_SYSTEMS_WITHOUT_FAILED_RULES } from '../SystemsTable/constants';

export const EditPolicy = ({ route }) => {
    const newInventory = useFeature('newInventory');
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
        newInventory && dispatch({
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

    const InvCmp = newInventory ? InventoryTable : SystemsTable;
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
                    <InvCmp
                        compact
                        showActions={ false }
                        enableExport={ false }
                        remediationsEnabled={ false }
                        policyId={ policy.id }
                        query={GET_SYSTEMS_WITHOUT_FAILED_RULES}
                        columns={[{
                            key: 'facts.compliance.display_name',
                            title: 'Name',
                            props: {
                                width: 40, isStatic: true
                            },
                            ...newInventory && {
                                key: 'display_name',
                                renderFunc: (displayName, id, extra) => {
                                    return extra?.lastScanned ? systemName(displayName, id, extra) : displayName;
                                }
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
