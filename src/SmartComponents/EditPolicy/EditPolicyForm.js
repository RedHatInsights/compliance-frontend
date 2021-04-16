import React, { useState, useEffect } from 'react';
import propTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Tab, TabTitleText } from '@patternfly/react-core';
import { RoutedTabs } from 'PresentationalComponents';
import EditPolicyDetailsTab from './EditPolicyDetailsTab';
import EditPolicyRulesTab from './EditPolicyRulesTab';
import EditPolicySystemsTab from './EditPolicySystemsTab';
import { mapCountOsMinorVersions } from 'Store/Reducers/SystemStore';

const profilesToOsMinorMap = (profiles, hosts) => (
    (profiles || []).reduce((acc, profile) => {
        if (profile.osMinorVersion !== '') {
            acc[profile.osMinorVersion] ||= { osMinorVersion: profile.osMinorVersion, count: 0 };
        }

        return acc;
    }, mapCountOsMinorVersions(hosts || []))
);

export const EditPolicyForm = ({
    policy,
    setUpdatedPolicy,
    selectedRuleRefIds, setSelectedRuleRefIds,
    setSelectedHosts
}) => {
    const policyProfiles = policy?.policy?.profiles || [];
    const dispatch = useDispatch();
    const [osMinorVersionCounts, setOsMinorVersionCounts] = useState({});
    const [newRuleTabs, setNewRuleTabs] = useState(false);
    const selectedEntities = useSelector((state) => (state?.entities?.selectedEntities));

    const handleRuleSelect = (profile, newSelectedRuleRefIds) => {
        const filteredSelection = selectedRuleRefIds.filter((selectedProfile) =>
            selectedProfile.id !== profile.id
        );
        setSelectedRuleRefIds([
            { id: profile.id, ruleRefIds: newSelectedRuleRefIds },
            ...filteredSelection
        ]);
    };

    const updateSelectedRuleRefIds = () => {
        if (policy) {
            setSelectedRuleRefIds(policyProfiles.map((policyProfile) => ({
                id: policyProfile.id,
                ruleRefIds: policyProfile.rules.map((rule) => (rule.refId))
            })));
        }
    };

    useEffect(() => {
        setSelectedHosts(selectedEntities ? selectedEntities : []);

        setOsMinorVersionCounts(
            profilesToOsMinorMap(policyProfiles, selectedEntities)
        );
    }, [selectedEntities]);

    useEffect(() => {
        if (policy) {
            const complianceThresholdValid =
                (policy.complianceThreshold < 101 && policy.complianceThreshold > 0);
            setUpdatedPolicy({
                ...policy,
                complianceThresholdValid
            });
            updateSelectedRuleRefIds();

            dispatch({
                type: 'SELECT_ENTITIES',
                payload: { ids: policy?.hosts || [] }
            });
            setOsMinorVersionCounts(
                profilesToOsMinorMap(policyProfiles, policy.hosts)
            );
        }
    }, [policy]);

    return (
        <Form>
            <RoutedTabs defaultTab='details'>
                <Tab eventKey='details' title={<TabTitleText>Details</TabTitleText>}>
                    <EditPolicyDetailsTab
                        policy={ policy }
                        setUpdatedPolicy={ setUpdatedPolicy } />
                </Tab>

                <Tab eventKey='rules' title={ <TabTitleText>Rules</TabTitleText> }>
                    <EditPolicyRulesTab
                        policy={ policy }
                        setNewRuleTabs={ setNewRuleTabs }
                        handleSelect={ handleRuleSelect }
                        selectedRuleRefIds={ selectedRuleRefIds }
                        osMinorVersionCounts={ osMinorVersionCounts }
                    />
                </Tab>

                <Tab eventKey='systems' title={ <TabTitleText>Systems</TabTitleText> }>
                    <EditPolicySystemsTab
                        osMajorVersion={ policy.osMajorVersion }
                        newRuleTabs={ newRuleTabs }
                    />
                </Tab>
            </RoutedTabs>
        </Form>
    );
};

EditPolicyForm.propTypes = {
    policy: propTypes.object,
    setUpdatedPolicy: propTypes.func,
    selectedRuleRefIds: propTypes.arrayOf(propTypes.object),
    setSelectedRuleRefIds: propTypes.func,
    setSelectedHosts: propTypes.func
};

export default EditPolicyForm;
