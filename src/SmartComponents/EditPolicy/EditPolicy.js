import React, { useState, useEffect } from 'react';
import propTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Button, Form, Modal, Tab, TabTitleText, Spinner } from '@patternfly/react-core';
import { RoutedTabs } from 'PresentationalComponents';
import { InventoryTable, SystemsTable } from 'SmartComponents';
import { useLinkToBackground, useAnchor } from 'Utilities/Router';
import { useTitleEntity } from 'Utilities/hooks/useDocumentTitle';
import EditPolicyDetailsTab from './EditPolicyDetailsTab';
import EditPolicyRulesTab from './EditPolicyRulesTab';
import usePolicy from './usePolicy';
import useFeature from 'Utilities/hooks/useFeature';
import { systemName } from 'Store/Reducers/SystemStore';
import { GET_SYSTEMS_WITHOUT_FAILED_RULES } from '../SystemsTable/constants';

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
        lastScanned
        policyType
        policy {
            id
            name
            refId
            profiles {
                id
                ssgVersion
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
    const newInventory = useFeature('newInventory');
    const multiversionRules = useFeature('multiversionTabs');
    const dispatch = useDispatch();
    const anchor = useAnchor();
    const [updatedPolicy, setUpdatedPolicy] = useState(null);
    const [selectedRuleRefIds, setSelectedRuleRefIds] = useState([]);
    const updatePolicy = usePolicy();
    const linkToBackground = useLinkToBackground('/scappolicies');
    const selectedEntities = useSelector((state) => (state?.entities?.selectedEntities));
    const saveEnabled = updatedPolicy && !updatedPolicy.complianceThresholdValid;

    const columns = [
        {
            key: 'facts.compliance.display_name',
            title: 'Name',
            props: {
                width: 40, isStatic: true
            },
            ...newInventory && {
                key: 'display_name',
                renderFunc: (displayName, id, extra) => {
                    return extra?.lastScanned ? systemName(displayName, id, { name: extra?.name }) : displayName;
                }
            }
        },
        {
            key: 'facts.compliance.osMinorVersion',
            title: 'Operating system',
            props: {
                width: 40, isStatic: true
            },
            ...newInventory && {
                key: 'osMinorVersion',
                renderFunc: (osMinorVersion, _id, { osMajorVersion }) => `RHEL ${osMajorVersion}.${osMinorVersion}`
            }
        }
    ];

    const linkToBackgroundWithHash = () => {
        newInventory && dispatch({
            type: 'SELECT_ENTITIES',
            payload: { ids: [] }
        });
        linkToBackground({ hash: anchor });
    };

    const handleRuleSelect = (profile, newSelectedRuleRefIds) => {
        const newSelection = selectedRuleRefIds.map((selectedProfile) => {
            if (selectedProfile.id === profile.id) {
                return {
                    id: selectedProfile.id,
                    ruleRefIds: newSelectedRuleRefIds
                };
            } else {
                return selectedProfile;
            }
        });

        setSelectedRuleRefIds(newSelection);
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

    useEffect(() => setUpdatedPolicy({ ...updatedPolicy, selectedRuleRefIds }), [selectedRuleRefIds]);

    useEffect(() => {

        if (policy) {
            const complianceThresholdValid =
                (policy.complianceThreshold < 101 && policy.complianceThreshold > 0);
            setUpdatedPolicy({
                ...policy,
                complianceThresholdValid
            });
            setSelectedRuleRefIds(policy.policy.profiles.map((policyProfile) => ({
                id: policyProfile.id,
                ruleRefIds: policyProfile.rules.map((rule) => (rule.refId))
            })));
            dispatch({
                type: 'SELECT_ENTITIES',
                payload: { ids: policy?.hosts?.map(({ id }) => ({ id })) || [] }
            });
        }
    }, [policy]);

    const InvCmp = newInventory ? InventoryTable : SystemsTable;
    useTitleEntity(route, policy?.name);

    return <Modal
        isOpen
        style={ { height: '400px' } }
        width={ 1000 }
        title={ `Edit ${ policy ? policy.name : '' }` }
        onClose={ () => linkToBackgroundWithHash() }
        actions={ actions }>
        { policy ? <Form>
            <RoutedTabs defaultTab='details'>
                <Tab eventKey='details' title={<TabTitleText>Details</TabTitleText>}>
                    <EditPolicyDetailsTab
                        policy={ policy }
                        setUpdatedPolicy={ setUpdatedPolicy } />
                </Tab>

                <Tab eventKey='rules' title={ <TabTitleText>Rules</TabTitleText> }>
                    { multiversionRules ?
                        <EditPolicyRulesTab
                            policy={ policy }
                            handleSelect={ handleRuleSelect }
                            selectedRuleRefIds={ selectedRuleRefIds }
                        /> : 'Rule editing coming soon' }
                </Tab>

                <Tab eventKey='systems' title={ <TabTitleText>Systems</TabTitleText> }>
                    <InvCmp
                        compact
                        showActions={ false }
                        enableExport={ false }
                        remediationsEnabled={ false }
                        policyId={ policy.id }
                        defaultFilter={ `os_major_version = ${policy.majorOsVersion}` }
                        query={GET_SYSTEMS_WITHOUT_FAILED_RULES}
                        columns={columns}
                        preselectedSystems={ (policy?.hosts || []).map((h) => ({ id: h.id })) || [] } />
                </Tab>
            </RoutedTabs>
        </Form> : <Spinner /> }
    </Modal>;
};

EditPolicy.propTypes = {
    route: propTypes.object
};

export default EditPolicy;
