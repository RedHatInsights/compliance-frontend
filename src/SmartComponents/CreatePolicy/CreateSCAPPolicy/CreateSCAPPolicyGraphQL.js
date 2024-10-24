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

  const isInUse = (profileRefId, benchmarkRedId) =>
    !!data?.profiles?.edges
      .map(({ node }) => node)
      .find(
        (profile) =>
          profile.refId === profileRefId &&
          benchmarkRedId === profile.benchmark.refId
      );

  const availableOsMajorVersions = data?.osMajorVersions?.edges?.map(
    ({ node }) => node.osMajorVersion
  );
  const selectedOsMajorVersionObject = data?.osMajorVersions?.edges?.find(
    ({ node }) => node.osMajorVersion === selectedOsMajorVersion
  );
  const availableProfiles = selectedOsMajorVersionObject?.node?.profiles.map(
    (profile) => ({
      ...profile,
      disabled: isInUse(profile.refId, profile.benchmark.refId),
    })
  );

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
        availableOsMajorVersionsLoading: loading,
        availableProfilesLoading: loading,
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
