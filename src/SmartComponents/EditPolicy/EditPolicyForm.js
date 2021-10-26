import React, { useState, useEffect } from 'react';
import propTypes from 'prop-types';
import { Form, Tab, TabTitleText } from '@patternfly/react-core';
import { RoutedTabs } from 'PresentationalComponents';
import EditPolicyDetailsTab from './EditPolicyDetailsTab';
import EditPolicyRulesTab from './EditPolicyRulesTab';
import EditPolicySystemsTab from './EditPolicySystemsTab';
import { mapCountOsMinorVersions } from 'Store/Reducers/SystemStore';
import { profilesWithRulesToSelection } from 'PresentationalComponents/TabbedRules';
import { thresholdValid } from '../CreatePolicy/validate';

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

export const EditPolicyForm = ({
  policy,
  updatedPolicy,
  setUpdatedPolicy,
  selectedRuleRefIds,
  setSelectedRuleRefIds,
  selectedSystems,
  setSelectedSystems,
}) => {
  const policyProfiles = policy?.policy?.profiles || [];
  const [osMinorVersionCounts, setOsMinorVersionCounts] = useState({});
  const [newRuleTabs, setNewRuleTabs] = useState(false);

  const handleSystemSelect = (selectedSystems) => {
    setSelectedSystems(selectedSystems);

    setOsMinorVersionCounts(
      profilesToOsMinorMap(policyProfiles, selectedSystems)
    );
  };

  const updateSelectedRuleRefIds = () => {
    if (policy) {
      // existing policy profiles and their rule sets
      const profilesWithOsMinor = policyProfiles.filter(
        ({ osMinorVersion }) => !!osMinorVersion
      );
      setSelectedRuleRefIds(profilesWithRulesToSelection(profilesWithOsMinor));
    }
  };

  useEffect(() => {
    if (policy) {
      const complianceThresholdValid = thresholdValid(
        policy.complianceThreshold
      );
      setUpdatedPolicy({
        ...policy,
        complianceThresholdValid,
      });
      updateSelectedRuleRefIds();
      handleSystemSelect(policy.hosts);
    }
  }, [policy]);

  return (
    <Form>
      <RoutedTabs ouiaId="EditPolicy" defaultTab="details">
        <Tab
          eventKey="details"
          ouiaId="Details"
          title={<TabTitleText>Details</TabTitleText>}
        >
          <EditPolicyDetailsTab
            policy={policy}
            updatedPolicy={updatedPolicy}
            setUpdatedPolicy={setUpdatedPolicy}
          />
        </Tab>

        <Tab
          eventKey="rules"
          ouiaId="Rules"
          title={<TabTitleText>Rules</TabTitleText>}
        >
          <EditPolicyRulesTab
            policy={policy}
            setNewRuleTabs={setNewRuleTabs}
            setSelectedRuleRefIds={setSelectedRuleRefIds}
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
            newRuleTabs={newRuleTabs}
            selectedSystems={selectedSystems}
            onSystemSelect={handleSystemSelect}
          />
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
};

export default EditPolicyForm;
