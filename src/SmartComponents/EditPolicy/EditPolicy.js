import React from 'react';
import { EditPolicyGraphQL } from './EditPolicyGraphQL';
import { EditPolicyRest } from './EditPolicyRest';
import GatedComponents from '../../PresentationalComponents/GatedComponents';

const EditPolicy = (props) => (
  <GatedComponents
    RestComponent={() => <EditPolicyRest {...props} />}
    GraphQLComponent={() => <EditPolicyGraphQL {...props} />}
  />
);

export default EditPolicy;
