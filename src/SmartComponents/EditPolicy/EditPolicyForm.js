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
  const assignedSystemsMap = useMemo(
    () => new Map(assignedSystems.map((system) => [system.id, system])),
    [assignedSystems],
  );

  const { preSelectedOsMinorVersions, assignedVersionCounts, assignedIds } =
    useMemo(() => {
      const versions = assignedSystems.map((system) => system.os_minor_version);
      return {
        preSelectedOsMinorVersions: [...new Set(versions)],
        assignedVersionCounts: getCounts(versions),
        assignedIds: assignedSystems.map((system) => system.id),
      };
    }, [assignedSystems]);

  const [selectedOsMinorVersions, setSelectedOsMinorVersions] = useState(
    preSelectedOsMinorVersions,
  );
  const [selectedVersionCounts, setSelectedVersionCounts] = useState(
    assignedVersionCounts,
  );
  const [selectedSystems, setSelectedSystems] = useState(assignedIds);
  const [newRulesAlert, setNewRulesAlert] = useNewRulesAlertState(false);

  const handleSystemSelect = useCallback(
    (newSelectedSystems) => {
      const completeSelectedSystems = newSelectedSystems.map(
        (system) => assignedSystemsMap.get(system.id) || system,
      );
      const newOsMinorVersions = [
        ...new Set(
          completeSelectedSystems.map((system) => system.os_minor_version),
        ),
      ];

      const hasNewOsMinorVersions = newOsMinorVersions.some(
        (version) => !preSelectedOsMinorVersions.includes(version),
      );

      setUpdatedPolicy((prev) => ({
        ...prev,
        hosts: newSelectedSystems.map((system) => system.id),
      }));
      setNewRulesAlert(hasNewOsMinorVersions);
      setSelectedOsMinorVersions(newOsMinorVersions);
      setSelectedVersionCounts(
        getCounts(
          completeSelectedSystems.map((system) => system.os_minor_version),
        ),
      );
      setSelectedSystems(newSelectedSystems.map((system) => system.id));
    },
    [
      preSelectedOsMinorVersions,
      assignedSystemsMap,
      setNewRulesAlert,
      setUpdatedPolicy,
    ],
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
