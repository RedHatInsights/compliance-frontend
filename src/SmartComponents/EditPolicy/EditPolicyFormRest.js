import React, { useCallback, useState } from 'react';
import propTypes from 'prop-types';
import { Form, Tab, TabTitleText } from '@patternfly/react-core';
import { RoutedTabs } from 'PresentationalComponents';
import EditPolicyRulesTabRest from './EditPolicyRulesTabRest';
import EditPolicySystemsTabRest from './EditPolicySystemsTabRest';
import NewRulesAlert from './components/NewRulesAlert';
import { useNewRulesAlertState } from './hooks/index';

const getCounts = (arr) =>
  arr.reduce(
    (prev, cur) => ({
      ...prev,
      [cur]: prev[cur] ? prev[cur] + 1 : 1,
    }),
    {}
  );

const EditPolicyForm = ({
  policy,
  setUpdatedPolicy,
  assignedRuleIds,
  assignedSystems,
  setRuleValues,
  supportedOsVersions,
}) => {
  const [selectedOsMinorVersions, setSelectedOsMinorVersions] = useState([
    ...new Set(assignedSystems.map((system) => system.os_minor_version)),
  ]);
  const [selectedVersionCounts, setSelectedVersionCounts] = useState(
    getCounts(assignedSystems.map((system) => system.os_minor_version))
  );
  const [newRulesAlert, setNewRulesAlert] = useNewRulesAlertState(false);

  const [selectedSystems, setSelectedSystems] = useState(
    assignedSystems?.map((system) => system.id)
  );
  const preUsedOsMinorVersions = assignedSystems.map(
    (system) => system.os_minor_version
  );

  const handleSystemSelect = useCallback(
    (newSelectedSystems) => {
      const newOsMinorVersions = [
        ...new Set(newSelectedSystems.map((system) => system.osMinorVersion)), // get unique values
      ];

      const hasNewOsMinorVersions =
        newOsMinorVersions.filter(
          (osMinorVersion) => !preUsedOsMinorVersions.includes(osMinorVersion)
        ).length > 0;

      setUpdatedPolicy((prev) => ({
        ...prev,
        hosts: newSelectedSystems.map((system) => system.id),
      }));
      setNewRulesAlert(hasNewOsMinorVersions);
      setSelectedOsMinorVersions(newOsMinorVersions);
      setSelectedVersionCounts(
        getCounts(newSelectedSystems.map((system) => system.osMinorVersion))
      );
      setSelectedSystems(newSelectedSystems.map((system) => system.id));
    },
    [preUsedOsMinorVersions, setNewRulesAlert, setUpdatedPolicy]
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
            assignedRuleIds={assignedRuleIds}
            selectedOsMinorVersions={selectedOsMinorVersions}
            selectedVersionCounts={selectedVersionCounts}
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
  assignedRuleIds: propTypes.arrayOf(propTypes.object),
  assignedSystems: propTypes.array,
  setRuleValues: propTypes.func,
  supportedOsVersions: propTypes.array,
};

export default EditPolicyForm;
