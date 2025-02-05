import React from 'react';
import propTypes from 'prop-types';
import { propTypes as reduxFormPropTypes } from 'redux-form';
import CreateSCAPPolicyBase from './CreateSCAPPolicyBase';
import dataSerialiser from 'Utilities/dataSerialiser';
import useSupportedProfiles from 'Utilities/hooks/api/useSupportedProfiles';
import useSecurityGuidesOS from 'Utilities/hooks/api/useSecurityGuidesOS';
import TableStateProvider from '@/Frameworks/AsyncTableTools/components/TableStateProvider';
import { useFullTableState } from '@/Frameworks/AsyncTableTools/hooks/useTableState';

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
  // we need table state to ensure default sorting is respected
  const tableState = useFullTableState();
  const {
    data: { data: availableProfiles, meta: { total } = {} } = {},
    loading: availableProfilesLoading,
    error: availableProfilesError,
  } = useSupportedProfiles({
    params: {
      filter: `os_major_version=${selectedOsMajorVersion}`,
    },
    useTableState: true,
    skip: selectedOsMajorVersion === undefined || tableState === undefined,
  });
  const serialisedProfilesData =
    availableProfiles &&
    dataSerialiser(serialiseOsVersions(availableProfiles), profilesDataMap);

  return (
    <CreateSCAPPolicyBase
      {...{
        selectedOsMajorVersion,
        selectedProfile,
        data:
          availableOsMajorVersions === undefined
            ? undefined
            : {
                availableOsMajorVersions,
                availableProfiles: serialisedProfilesData,
              },
        availableOsMajorVersionsLoading,
        availableProfilesLoading,
        total,
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

const CreateSCAPPolicyTableStateProvider = (props) => (
  <TableStateProvider>
    <CreateSCAPPolicyRest {...props} />
  </TableStateProvider>
);

export default CreateSCAPPolicyTableStateProvider;
