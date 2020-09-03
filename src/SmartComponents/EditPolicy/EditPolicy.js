import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button, Form, Modal, Tab, TabTitleText } from '@patternfly/react-core';
import { RoutedTabs } from 'PresentationalComponents';
import { SystemsTable } from 'SmartComponents';
import { useLinkToBackground, useAnchor } from 'Utilities/Router';
import EditPolicyDetailsTab from './EditPolicyDetailsTab';
import usePolicyUpdate from './usePolicyUpdate';

export const EditPolicy = () => {
    const location = useLocation();
    const policy = location?.state?.policy;
    const anchor = useAnchor();
    const [updatedPolicy, setUpdatedPolicy] = useState(null);
    const updatePolicy = usePolicyUpdate();
    const linkToBackground = useLinkToBackground('/scappolicies');
    const linkToBackgroundWithHash = () => (linkToBackground({ hash: anchor }));
    const selectedEntities = useSelector((state) => (state?.entities?.selectedEntities));
    const saveEnabled = updatedPolicy && !updatedPolicy.complianceThresholdValid;
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
    }, [policy]);

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
                    <SystemsTable
                        compact
                        showActions={ false }
                        enableExport={ false }
                        showAllSystems
                        remediationsEnabled={ false }
                        policyId={ policy.id }
                        columns={[{
                            key: 'facts.compliance.display_name',
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

export default EditPolicy;
