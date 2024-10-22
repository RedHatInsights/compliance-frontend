import React from 'react';
import FinishedCreatePolicyBase from './FinishedCreatePolicyBase';
import { usePolicy } from '../../../Mutations';

const FinishedCreatePolicyGraphQL = (props) => {
  const updatePolicy = usePolicy();

  return <FinishedCreatePolicyBase updatePolicy={updatePolicy} {...props} />;
};

export default FinishedCreatePolicyGraphQL;
