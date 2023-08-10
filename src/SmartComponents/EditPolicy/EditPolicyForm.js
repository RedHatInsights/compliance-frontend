import React, { useCallback, useState, useEffect } from 'react';
import propTypes from 'prop-types';
import { Form, Tab, TabTitleText } from '@patternfly/react-core';
import { RoutedTabs } from 'PresentationalComponents';
import EditPolicyRulesTab from './EditPolicyRulesTab';
import EditPolicySystemsTab from './EditPolicySystemsTab';
import NewRulesAlert from './components/NewRulesAlert';
import { mapCountOsMinorVersions } from 'Store/Reducers/SystemStore';
import { profilesWithRulesToSelection } from 'PresentationalComponents/TabbedRules';
import { thresholdValid } from '../CreatePolicy/validate';
import { useNewRulesAlertState } from './hooks/index';

const profilesToOsMinorMap = (profiles, hosts) =>
  (profiles || []).reduce((acc, profile) => {
    if (profile.osMinorVersion !== '') {
      acc[profile.osMinorVersion] ||= {
        osMinorVersion: profile.osMinorVersion,
        count: 0,
      };
    }

    return acc;
  }, mapCountOsMinorVersions(hosts || []));

const EditPolicyForm = ({
  policy,
  setUpdatedPolicy,
  selectedRuleRefIds,
  setSelectedRuleRefIds,
  selectedSystems,
  setSelectedSystems,
  setRuleValues,
  ruleValues,
}) => {
  const policyProfiles = policy?.policy?.profiles || [];
  const [osMinorVersionCounts, setOsMinorVersionCounts] = useState({});
  const [newRulesAlert, setNewRulesAlert] = useNewRulesAlertState(false);

  const handleSystemSelect = useCallback(
    (newSelectedSystems) => {
      const policyMinorVersions = policy.hosts.map(
        ({ osMinorVersion }) => osMinorVersion
      );
      const hasNewOsMinorVersions =
        newSelectedSystems.filter(
          ({ osMinorVersion }) => !policyMinorVersions.includes(osMinorVersion)
        ).length > 0;

      setSelectedSystems(newSelectedSystems);
      setNewRulesAlert(hasNewOsMinorVersions);
      setOsMinorVersionCounts(
        profilesToOsMinorMap(policyProfiles, newSelectedSystems)
      );
    },
    [policyProfiles, selectedRuleRefIds]
  );

  useEffect(() => {
    if (policy) {
      const complianceThresholdValid = thresholdValid(
        policy.complianceThreshold
      );
      const profilesWithOsMinor = policyProfiles.filter(
        ({ osMinorVersion }) => !!osMinorVersion
      );
      setUpdatedPolicy({
        ...policy,
        complianceThresholdValid,
      });

      setSelectedRuleRefIds(profilesWithRulesToSelection(profilesWithOsMinor));
      handleSystemSelect(policy.hosts);
    }
  }, [policy]);

  return (
    <Form>
      <RoutedTabs ouiaId="EditSystems" defaultTab="rules" id="policy-tabs">
        <Tab
          eventKey="rules"
          ouiaId="Rules"
          title={<TabTitleText>Rules</TabTitleText>}
        >
          <EditPolicyRulesTab
            policy={policy}
            setSelectedRuleRefIds={setSelectedRuleRefIds}
            setRuleValues={setRuleValues}
            ruleValues={ruleValues}
            selectedRuleRefIds={selectedRuleRefIds}
            osMinorVersionCounts={osMinorVersionCounts}
          />
        </Tab>
        <Tab
          eventKey="systems"
          ouiaId="Systems"
          title={<TabTitleText>Systems</TabTitleText>}
        >
          <EditPolicySystemsTab
            policy={policy}
            selectedSystems={selectedSystems}
            onSystemSelect={handleSystemSelect}
          />
          {newRulesAlert && <NewRulesAlert />}
        </Tab>
      </RoutedTabs>
    </Form>
  );
};

EditPolicyForm.propTypes = {
  policy: propTypes.object,
  updatedPolicy: propTypes.object,
  setUpdatedPolicy: propTypes.func,
  selectedRuleRefIds: propTypes.arrayOf(propTypes.object),
  setSelectedRuleRefIds: propTypes.func,
  setSelectedSystems: propTypes.func,
  selectedSystems: propTypes.array,
  setRuleValues: propTypes.func,
  ruleValues: propTypes.array,
};

export default EditPolicyForm;
