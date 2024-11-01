import React from 'react';
import propTypes from 'prop-types';
import { propTypes as reduxFormPropTypes } from 'redux-form';
import CreateSCAPPolicyBase from './CreateSCAPPolicyBase';
import dataSerialiser from 'Utilities/dataSerialiser';
import useSupportedProfiles from 'Utilities/hooks/api/useSupportedProfiles';
import useSecurityGuidesOS from 'Utilities/hooks/api/useSecurityGuidesOS';

const profilesDataMap = {
  id: ['id', 'benchmark.id'],
  description: 'description',
  title: 'name',
  ref_id: 'refId',
  supportedOsVersions: 'supportedOsVersions',
};

const serialiseOsVersions = (profiles = []) =>
  profiles.map((profile) => ({
    ...profile,
    supportedOsVersions: profile.os_minor_versions.map(
      (minorVersion) => `${profile.os_major_version}.${minorVersion}`
    ),
  }));

const CreateSCAPPolicyRest = ({
  selectedOsMajorVersion,
  selectedProfile,
  change,
}) => {
  const {
    data: availableOsMajorVersions,
    error: availableOsMajorVersionsError,
    loading: availableOsMajorVersionsLoading,
  } = useSecurityGuidesOS();
  const {
    data: availableProfiles,
    error: availableProfilesError,
    loading: availableProfilesLoading,
  } = useSupportedProfiles({
    params: {
      filter: selectedOsMajorVersion
        ? `os_major_version=${selectedOsMajorVersion}`
        : undefined,
    },
    skip: selectedOsMajorVersion === undefined,
  });

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
                availableProfiles: dataSerialiser(
                  serialiseOsVersions(availableProfiles?.data),
                  profilesDataMap
                ),
              },
        availableOsMajorVersionsLoading,
        availableProfilesLoading,
        error: availableOsMajorVersionsError || availableProfilesError,
        change,
      }}
    />
  );
};

CreateSCAPPolicyRest.propTypes = {
  change: reduxFormPropTypes.change,
  selectedProfile: propTypes.object,
  selectedOsMajorVersion: propTypes.string,
};

export default CreateSCAPPolicyRest;
