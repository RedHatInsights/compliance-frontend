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
  selectedSystems: selectedSystemsProp,
  setRuleValues,
  supportedOsVersions,
}) => {
  const [selectedOsMinorVersions, setSelectedOsMinorVersions] =
    useState(supportedOsVersions);
  const [newRulesAlert, setNewRulesAlert] = useNewRulesAlertState(false);

  const [selectedSystems, setSelectedSystems] = useState(
    selectedSystemsProp?.map((system) => system.id)
  );
  const preUsedOsMinorVersions = selectedSystemsProp.map(
    (system) => system.os_minor_version
  );

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
      setSelectedOsMinorVersions(newOsMinorVersions);
      setSelectedSystems(selectedSystems);
    },
    [
      preUsedOsMinorVersions,
      selectedSystems,
      setNewRulesAlert,
      setUpdatedPolicy,
    ]
  );

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
            selectedRuleRefIds={selectedRuleRefIds}
            selectedOsMinorVersions={selectedOsMinorVersions}
            setUpdatedPolicy={setUpdatedPolicy}
          />
        </Tab>
        <Tab
          eventKey="systems"
          ouiaId="Systems"
          title={<TabTitleText>Systems</TabTitleText>}
        >
          <EditPolicySystemsTabRest
            policy={policy}
            selectedSystems={selectedSystems}
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
  supportedOsVersions: propTypes.array,
};

export default EditPolicyForm;
