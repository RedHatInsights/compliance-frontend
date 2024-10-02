import React from 'react';
import propTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { propTypes as reduxFormPropTypes } from 'redux-form';
import { SUPPORTED_PROFILES } from '../constants';
import CreateSCAPPolicyBase from './CreateSCAPPolicyBase';

const CreateSCAPPolicyGraphQL = ({
  selectedOsMajorVersion,
  selectedProfile,
  change,
}) => {
  const { data, error, loading } = useQuery(SUPPORTED_PROFILES, {
    fetchPolicy: 'no-cache',
  });
  const availableOsMajorVersions = data?.osMajorVersions?.edges?.map(
    ({ node }) => node.osMajorVersion
  );
  const selectedOsMajorVersionObject = data?.osMajorVersions?.edges?.find(
    ({ node }) => node.osMajorVersion === selectedOsMajorVersion
  );
  const availableProfiles = selectedOsMajorVersionObject?.node?.profiles;

  return (
    <CreateSCAPPolicyBase
      {...{
        selectedOsMajorVersion,
        selectedProfile,
        data:
          availableOsMajorVersions === undefined &&
          availableProfiles === undefined
            ? undefined
            : {
                availableOsMajorVersions,
                availableProfiles,
              },
        loading,
        error,
        change,
      }}
    />
  );
};

CreateSCAPPolicyGraphQL.propTypes = {
  change: reduxFormPropTypes.change,
  selectedProfile: propTypes.object,
  selectedOsMajorVersion: propTypes.string,
};

export default CreateSCAPPolicyGraphQL;
