/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/display-name */
import React, { useMemo } from 'react';
import { EditPolicyGraphQL } from './EditPolicyGraphQL';
import { EditPolicyRest } from './EditPolicyRest';
import GatedComponents from '../../PresentationalComponents/GatedComponents';

const EditPolicy = (props) => {
  const RestComponent = useMemo(
    () => () => <EditPolicyRest {...props} />,
    [JSON.stringify(props)] // the route prop from react-router is not stable
  );
  const GraphQLComponent = useMemo(
    () => () => <EditPolicyGraphQL {...props} />,
    [JSON.stringify(props)] // the route prop from react-router is not stable
  );

  return (
    <GatedComponents
      RestComponent={RestComponent}
      GraphQLComponent={GraphQLComponent}
    />
  );
};

export default EditPolicy;
