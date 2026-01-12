import React, { useCallback, useMemo, useState } from 'react';
import propTypes from 'prop-types';
import { Form, Tab, TabTitleText } from '@patternfly/react-core';
import { RoutedTabs } from 'PresentationalComponents';
import EditPolicyRulesTab from './EditPolicyRulesTab';
import EditPolicySystemsTab from './EditPolicySystemsTab';
import NewRulesAlert from './components/NewRulesAlert';
import { useNewRulesAlertState } from './hooks/index';

const getCounts = (arr) =>
  arr.reduce(
    (prev, cur) => ({
      ...prev,
      [cur]: prev[cur] ? prev[cur] + 1 : 1,
    }),
    {},
  );

const EditPolicyForm = ({
  policy,
  setUpdatedPolicy,
  updatedPolicy,
  assignedRuleIds,
  assignedSystems,
  setRuleValues,
  supportedOsVersions,
  setIsSystemsDataLoading,
}) => {
  const preUsedOsMinorVersions = useMemo(
    () => assignedSystems.map((system) => system.os_minor_version),
    [assignedSystems],
  );

  const [selectedOsMinorVersions, setSelectedOsMinorVersions] = useState(() => [
    ...new Set(preUsedOsMinorVersions),
  ]);
  const [selectedVersionCounts, setSelectedVersionCounts] = useState(() =>
    getCounts(preUsedOsMinorVersions),
  );
  const [selectedSystems, setSelectedSystems] = useState(() =>
    assignedSystems?.map((system) => system.id),
  );
  const [newRulesAlert, setNewRulesAlert] = useNewRulesAlertState(false);

  const handleSystemSelect = useCallback(
    (newSelectedSystems) => {
      const osMinorVersions = newSelectedSystems.map(
        (system) => system.os_minor_version,
      );
      const uniqueVersions = [...new Set(osMinorVersions)];

      const hasNewOsMinorVersion = uniqueVersions.some(
        (version) => !preUsedOsMinorVersions.includes(version),
      );

      setUpdatedPolicy((prev) => ({
        ...prev,
        hosts: newSelectedSystems.map((system) => system.id),
      }));
      setNewRulesAlert(hasNewOsMinorVersion);
      setSelectedSystems(newSelectedSystems.map((system) => system.id));
      setSelectedOsMinorVersions(uniqueVersions);
      setSelectedVersionCounts(getCounts(osMinorVersions));
    },
    [preUsedOsMinorVersions, setNewRulesAlert, setUpdatedPolicy],
  );

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
            setRuleValues={setRuleValues}
            assignedRuleIds={assignedRuleIds}
            selectedOsMinorVersions={selectedOsMinorVersions}
            selectedVersionCounts={selectedVersionCounts}
            setUpdatedPolicy={setUpdatedPolicy}
            updatedPolicy={updatedPolicy}
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
            preselectedItems={assignedSystems}
            onSystemSelect={handleSystemSelect}
            supportedOsVersions={supportedOsVersions}
            setIsSystemsDataLoading={setIsSystemsDataLoading}
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
  setIsSystemsDataLoading: propTypes.func,
};

export default EditPolicyForm;
