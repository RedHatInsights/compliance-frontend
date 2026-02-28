import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { FormRenderer } from '@data-driven-forms/react-form-renderer';
import editPolicySchema from './editPolicySchema';
import editPolicyComponentMapper from './editPolicyComponentMapper';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template';
// import { useNewRulesAlertState } from './hooks/index';

// const getCounts = (arr) =>
//   arr.reduce(
//     (prev, cur) => ({
//       ...prev,
//       [cur]: prev[cur] ? prev[cur] + 1 : 1,
//     }),
//     {},
//   );

const EditPolicyFormDDF = ({
  policy,
  updatedPolicy,
  setUpdatedPolicy,
  assignedRuleIds,
  assignedSystems,
  setRuleValues,
  supportedOsVersions,
  setIsSystemsDataLoading,
}) => {
  // const assignedSystemsMap = useMemo(
  //   () => new Map(assignedSystems.map((system) => [system.id, system])),
  //   [assignedSystems],
  // );

  // const { preSelectedOsMinorVersions, assignedVersionCounts, assignedIds } =
  //   useMemo(() => {
  //     const versions = assignedSystems.map((system) => system.os_minor_version);
  //     return {
  //       preSelectedOsMinorVersions: [...new Set(versions)],
  //       assignedVersionCounts: getCounts(versions),
  //       assignedIds: assignedSystems.map((system) => system.id),
  //     };
  //   }, [assignedSystems]);

  // const [selectedOsMinorVersions, setSelectedOsMinorVersions] = useState(
  //   preSelectedOsMinorVersions,
  // );
  // const [selectedVersionCounts, setSelectedVersionCounts] = useState(
  //   assignedVersionCounts,
  // );
  // const [selectedSystems, setSelectedSystems] = useState(assignedIds);
  // const [newRulesAlert, setNewRulesAlert] = useNewRulesAlertState(false);

  // const handleSystemSelect = useCallback(
  //   (newSelectedSystems) => {
  //     const completeSelectedSystems = newSelectedSystems.map(
  //       (system) => assignedSystemsMap.get(system.id) || system,
  //     );
  //     const newOsMinorVersions = [
  //       ...new Set(
  //         completeSelectedSystems.map((system) => system.os_minor_version),
  //       ),
  //     ];

  //     const hasNewOsMinorVersions = newOsMinorVersions.some(
  //       (version) => !preSelectedOsMinorVersions.includes(version),
  //     );

  //     setUpdatedPolicy((prev) => ({
  //       ...prev,
  //       hosts: newSelectedSystems.map((system) => system.id),
  //     }));
  //     setNewRulesAlert(hasNewOsMinorVersions);
  //     setSelectedOsMinorVersions(newOsMinorVersions);
  //     setSelectedVersionCounts(
  //       getCounts(
  //         completeSelectedSystems.map((system) => system.os_minor_version),
  //       ),
  //     );
  //     setSelectedSystems(newSelectedSystems.map((system) => system.id));
  //   },
  //   [
  //     preSelectedOsMinorVersions,
  //     assignedSystemsMap,
  //     setNewRulesAlert,
  //     setUpdatedPolicy,
  //   ],
  // );

  const schema = useMemo(
    () =>
      editPolicySchema(
        {
          // policy,
          // setRuleValues,
          // assignedRuleIds,
          // // selectedOsMinorVersions,
          // // selectedVersionCounts,
          // setUpdatedPolicy,
          // updatedPolicy,
        },
        {
          policy,
          // onSystemSelect: handleSystemSelect,
          assignedSystems,
          // selectedSystems,
          setUpdatedPolicy,
          supportedOsVersions,
          setIsSystemsDataLoading,
        },
      ),
    [
      policy,
      setUpdatedPolicy,
      // assignedRuleIds,
      // updatedPolicy,
      // setRuleValues,
      // selectedOsMinorVersions,
      // selectedVersionCounts,
      // handleSystemSelect,
      assignedSystems,
      // selectedSystems,
      supportedOsVersions,
      setIsSystemsDataLoading,
    ],
  );
  console.log('DEBUG schema', schema);

  return (
    <FormRenderer
      schema={schema}
      componentMapper={editPolicyComponentMapper}
      FormTemplate={(props) => (
        <FormTemplate {...props} showFormControls={false} />
      )}
    />
  );
};

EditPolicyFormDDF.propTypes = {
  policy: PropTypes.object,
  updatedPolicy: PropTypes.object,
  setUpdatedPolicy: PropTypes.func,
  assignedRuleIds: PropTypes.array,
  assignedSystems: PropTypes.array,
  setRuleValues: PropTypes.func,
  supportedOsVersions: PropTypes.array,
  securityGuide: PropTypes.object,
  setIsSystemsDataLoading: PropTypes.func,
};

export default EditPolicyFormDDF;
