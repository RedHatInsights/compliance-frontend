import React, { useCallback, useMemo, useState } from 'react';
import EditPolicySystemsTab from './EditPolicySystemsTab';
import { useNewRulesAlertState } from './hooks/index';

const getCounts = (arr) =>
  arr.reduce(
    (prev, cur) => ({
      ...prev,
      [cur]: prev[cur] ? prev[cur] + 1 : 1,
    }),
    {},
  );

const EditPolicySystemsField = (props) => {
  const {
    policy,
    // onSystemSelect,
    assignedSystems,
    // selectedSystems,
    supportedOsVersions,
    setIsSystemsDataLoading,
    setUpdatedPolicy,
  } = props.fieldProps;

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

  const [selectedSystems, setSelectedSystems] = useState(assignedIds);

  const [newRulesAlert, setNewRulesAlert] = useNewRulesAlertState(false);

  const handleSystemSelect = useCallback(
    (newSelectedSystems) => {
      const newIds = [...newSelectedSystems.map((s) => s.id)].sort();
      const currentIds = [...selectedSystems].sort();
      if (
        currentIds.length === newIds.length &&
        currentIds.every((id, i) => id === newIds[i])
      ) {
        return;
      }

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
      // setSelectedOsMinorVersions(newOsMinorVersions);
      // setSelectedVersionCounts(
      //   getCounts(
      //     completeSelectedSystems.map((system) => system.os_minor_version),
      //   ),
      // );
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
    <>
      <EditPolicySystemsTab
      policy={policy}
      onSystemSelect={handleSystemSelect}
      selectedSystems={selectedSystems}
      supportedOsVersions={supportedOsVersions}
      setIsSystemsDataLoading={setIsSystemsDataLoading}
      />
      {newRulesAlert && <NewRulesAlert />}
    </>
  );
};

export default EditPolicySystemsField;
