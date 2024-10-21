import React, { useCallback, useState } from 'react';
import propTypes from 'prop-types';
import { Form, Tab, TabTitleText } from '@patternfly/react-core';
import { RoutedTabs } from 'PresentationalComponents';
import EditPolicyRulesTabRest from './EditPolicyRulesTabRest';
import EditPolicySystemsTabRest from './EditPolicySystemsTabRest';
import NewRulesAlert from './components/NewRulesAlert';
import { useNewRulesAlertState } from './hooks/index';
import uniq from 'lodash/uniq';

const EditPolicyForm = ({
  policy,
  setUpdatedPolicy,
  selectedRuleRefIds,
  selectedSystems,
  setRuleValues,
  ruleValues,
  supportedOsVersions,
}) => {
  const preUsedOsMinorVersions = selectedSystems.map(
    (system) => system.os_minor_version
  );
  const [selectedOsMinorVersions, setSelectedOsMinorVersions] =
    useState(supportedOsVersions);
  const [newRulesAlert, setNewRulesAlert] = useNewRulesAlertState(false);

  const handleSystemSelect = useCallback(
    (newSelectedSystems) => {
      const newOsMinorVersions = uniq(
        newSelectedSystems.map((system) => system.osMinorVersion)
      );

      const hasNewOsMinorVersions =
        newOsMinorVersions.filter(
          (osMinorVersion) => !preUsedOsMinorVersions.includes(osMinorVersion)
        ).length > 0;

      setUpdatedPolicy((prev) => ({
        ...prev,
        hosts: newSelectedSystems,
      }));
      setNewRulesAlert(hasNewOsMinorVersions);
      // console.log(newSelectedSystems, hasNewOsMinorVersions, newOsMinorVersions,  'debug: new selectedSystems');
      setSelectedOsMinorVersions(newOsMinorVersions);
    },
    [preUsedOsMinorVersions, setNewRulesAlert, setUpdatedPolicy]
  );

  // useEffect(() => {
  //   if (policy) {
  //     const complianceThresholdValid = thresholdValid(
  //       policy.complianceThreshold
  //     );
  //     const profilesWithOsMinor = policyProfiles.filter(
  //       ({ osMinorVersion }) => !!osMinorVersion
  //     );
  //     setUpdatedPolicy({
  //       ...policy,
  //       complianceThresholdValid,
  //     });

  //     setSelectedRuleRefIds(profilesWithRulesToSelection(profilesWithOsMinor));
  //     handleSystemSelect(policy.hosts);
  //   }
  // }, [policy]);

  return (
    <Form>
      <RoutedTabs ouiaId="EditSystems" defaultTab="rules" id="policy-tabs">
        <Tab
          eventKey="rules"
          ouiaId="Rules"
          title={<TabTitleText>Rules</TabTitleText>}
        >
          <EditPolicyRulesTabRest
            policy={policy}
            setRuleValues={setRuleValues}
            ruleValues={ruleValues}
            selectedRuleRefIds={selectedRuleRefIds}
            selectedOsMinorVersions={selectedOsMinorVersions}
          />
        </Tab>
        <Tab
          eventKey="systems"
          ouiaId="Systems"
          title={<TabTitleText>Systems</TabTitleText>}
        >
          <EditPolicySystemsTabRest
            policy={policy}
            selectedSystems={selectedSystems?.map((system) => system.id)}
            onSystemSelect={handleSystemSelect}
            supportedOsVersions={supportedOsVersions}
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
  selectedSystems: propTypes.array,
  setRuleValues: propTypes.func,
  ruleValues: propTypes.array,
  supportedOsVersions: propTypes.array,
};

export default EditPolicyForm;
