import React, { useEffect } from 'react';
import { useFormApi, FormSpy } from '@data-driven-forms/react-form-renderer';
import {
  Form,
  FormGroup,
  Spinner,
  Content,
  ContentVariants,
} from '@patternfly/react-core';
import { Tile } from '@patternfly/react-core/deprecated';
import { TableStateProvider } from 'bastilian-tabletools';
import propTypes from 'prop-types';
import useSupportedProfiles from 'Utilities/hooks/api/useSupportedProfiles';
import useSecurityGuidesOS from 'Utilities/hooks/api/useSecurityGuidesOS';
import { StateViewPart, StateViewWithError } from 'PresentationalComponents';
import PolicyTypesTable from 'SmartComponents/CreatePolicy/Components/PolicyTypeTable';
import PolicyTypeTooltip from 'SmartComponents/CreatePolicy/Components/PolicyTypeTooltip';

const serialiseOsVersions = (profiles = []) =>
  profiles.map((profile) => ({
    ...profile,
    supportedOsVersions: profile.os_minor_versions.map(
      (minorVersion) => `${profile.os_major_version}.${minorVersion}`,
    ),
  }));

const CreateSCAPPolicyStepContent = ({
  selectedOsMajorVersion,
  selectedProfile,
}) => {
  const { change } = useFormApi();

  useEffect(() => {
    if (selectedOsMajorVersion && selectedProfile) {
      change('scap-policy-selection-validation', 'valid');
    } else {
      change('scap-policy-selection-validation', 'pending');
    }
  }, [selectedOsMajorVersion, selectedProfile, change]);

  const {
    data: { data: availableOsMajorVersions } = {},
    error: availableOsMajorVersionsError,
    loading: availableOsMajorVersionsLoading,
  } = useSecurityGuidesOS();

  const {
    data: { data: availableProfiles, meta: { total } = {} } = {},
    loading: availableProfilesLoading,
    error: availableProfilesError,
  } = useSupportedProfiles({
    params: {
      filters: `os_major_version ^ (${selectedOsMajorVersion})`,
    },
    useTableState: true,
    skip: selectedOsMajorVersion === undefined,
  });

  const profilesData =
    availableProfiles && serialiseOsVersions(availableProfiles);

  const data =
    availableOsMajorVersions === undefined
      ? undefined
      : {
          availableOsMajorVersions,
          availableProfiles: profilesData,
        };

  return (
    <StateViewWithError
      stateValues={{
        error: availableOsMajorVersionsError || availableProfilesError,
        data,
        loading: availableOsMajorVersionsLoading,
      }}
    >
      <StateViewPart stateKey="loading">
        <Spinner />
      </StateViewPart>
      <StateViewPart stateKey="data">
        <Content>
          <Content component={ContentVariants.h1} className="pf-v6-u-mb-md">
            Create SCAP policy
          </Content>
          <Content component="p" className="pf-v6-u-mb-md">
            Select the operating system and policy type for this policy.
          </Content>
        </Content>
        <Form>
          <FormGroup
            label="Operating system"
            isRequired
            fieldId="security-guide"
          >
            {(data?.availableOsMajorVersions || []).map((osMajorVersion) => (
              <Tile
                key={`rhel${osMajorVersion}-select`}
                className="pf-v6-u-mr-md"
                title={`RHEL ${osMajorVersion}`}
                onClick={() => {
                  change('osMajorVersion', osMajorVersion);
                }}
                isSelected={selectedOsMajorVersion === osMajorVersion}
                isStacked
              />
            ))}
          </FormGroup>
          {selectedOsMajorVersion && (
            <FormGroup
              isRequired
              labelHelp={<PolicyTypeTooltip />}
              label="Policy type"
              fieldId="policy-type"
            >
              <PolicyTypesTable
                profiles={data?.availableProfiles || []}
                onChange={(profile) => {
                  change('profile', profile);
                  change('selectedRuleRefIds', undefined);
                  change('systems', []);
                }}
                selectedProfile={selectedProfile}
                loading={availableProfilesLoading}
                total={total}
              />
            </FormGroup>
          )}
        </Form>
      </StateViewPart>
    </StateViewWithError>
  );
};

CreateSCAPPolicyStepContent.propTypes = {
  selectedOsMajorVersion: propTypes.string,
  selectedProfile: propTypes.object,
};

const CreateSCAPPolicyStep = () => (
  <FormSpy subscription={{ values: true }}>
    {({ values }) => (
      <TableStateProvider>
        <CreateSCAPPolicyStepContent
          selectedOsMajorVersion={values.osMajorVersion}
          selectedProfile={values.profile}
        />
      </TableStateProvider>
    )}
  </FormSpy>
);

export default CreateSCAPPolicyStep;
