import React from 'react';
// import EditPolicyRulesTab from './EditPolicyRulesTab';

const EditPolicyRulesField = (props) => {
  const {
    policy,
    setRuleValues,
    assignedRuleIds,
    selectedOsMinorVersions,
    selectedVersionCounts,
    setUpdatedPolicy,
    updatedPolicy,
  } = props.fieldProps;

  // return <EditPolicyRulesTab
  //   policy={policy}
  //   setRuleValues={setRuleValues}
  //   assignedRuleIds={assignedRuleIds}
  //   selectedOsMinorVersions={selectedOsMinorVersions}
  //   selectedVersionCounts={selectedVersionCounts}
  //   setUpdatedPolicy={setUpdatedPolicy}
  //   updatedPolicy={updatedPolicy}
  // />;

  return <div>Rules</div>;
};

export default EditPolicyRulesField;
