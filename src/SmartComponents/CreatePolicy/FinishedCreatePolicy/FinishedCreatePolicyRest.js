import React from 'react';
import FinishedCreatePolicyBase from './FinishedCreatePolicyBase';
import useCreatePolicy from '../../../Utilities/hooks/api/useCreatePolicy';
import useAssignRules from '../../../Utilities/hooks/api/useAssignRules';
import useAssignSystems from '../../../Utilities/hooks/api/useAssignSystems';

const FinishedCreatePolicyRest = (props) => {
  const createPolicy = useCreatePolicy();
  const assignSystems = useAssignSystems();
  const assingRules = useAssignRules();

  const updatePolicy = async (_, newPolicy, onProgress) => {
    console.log('### on updatePolicy', _, newPolicy, onProgress);
  };

  return <FinishedCreatePolicyBase updatePolicy={updatePolicy} {...props} />;
};

export default FinishedCreatePolicyRest;
