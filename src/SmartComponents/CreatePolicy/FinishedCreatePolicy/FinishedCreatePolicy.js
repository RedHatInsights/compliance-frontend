import React from 'react';
import useAPIV2FeatureFlag from '../../../Utilities/hooks/useAPIV2FeatureFlag';
import { Bullseye, Spinner } from '@patternfly/react-core';
import FinishedCreatePolicyRest from './FinishedCreatePolicyRest';
import FinishedCreatePolicyGraphQL from './FinishedCreatePolicyGraphQL';

const FinishedCreatePolicy = (props) => {
  const apiV2Enabled = useAPIV2FeatureFlag();

  return apiV2Enabled === undefined ? (
    <Bullseye>
      <Spinner />
    </Bullseye>
  ) : apiV2Enabled ? (
    <FinishedCreatePolicyRest {...props} />
  ) : (
    <FinishedCreatePolicyGraphQL {...props} />
  );
};

export default FinishedCreatePolicy;
