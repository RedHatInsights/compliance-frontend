import React from 'react';
import { Bullseye, Spinner } from '@patternfly/react-core';
import useAPIV2FeatureFlag from '@/Utilities/hooks/useAPIV2FeatureFlag';
import { EditPolicyGraphQL } from './EditPolicyGraphQL';
import { EditPolicyRest } from './EditPolicyRest';

const EditPolicy = (props) => {
  const apiV2Enabled = useAPIV2FeatureFlag();

  return apiV2Enabled === undefined ? (
    <Bullseye>
      <Spinner />
    </Bullseye>
  ) : apiV2Enabled === true ? (
    <EditPolicyRest {...props} />
  ) : (
    <EditPolicyGraphQL {...props} />
  );
};

export default EditPolicy;
