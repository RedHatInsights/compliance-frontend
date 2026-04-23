import React, { useEffect, useRef } from 'react';
import {
  useFormApi,
  useFieldApi,
  FormSpy,
} from '@data-driven-forms/react-form-renderer';
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
import {
  StateViewPart,
  StateViewWithError,
  PolicyTypesTable,
  PolicyTypeTooltip,
} from 'PresentationalComponents';

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
  input,
}) => {
  const { change } = useFormApi();
  const inputRef = useRef(input);
  inputRef.current = input;

  useEffect(() => {
    inputRef.current.onChange(
      selectedOsMajorVersion && selectedProfile ? { isValid: true } : undefined,
    );
  }, [selectedOsMajorVersion, selectedProfile]);

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
      // The reason we are using the ^ operator is because Akamai is blocking
      // this request when it's combined with title filter. See: RHINENG-23142
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
  input: propTypes.shape({ onChange: propTypes.func.isRequired }).isRequired,
};

const CreateSCAPPolicyStep = (props) => {
  const { input } = useFieldApi(props);

  return (
    <TableStateProvider>
      <FormSpy subscription={{ values: true }}>
        {({ values }) => (
          <CreateSCAPPolicyStepContent
            selectedOsMajorVersion={values.osMajorVersion}
            selectedProfile={values.profile}
            input={input}
          />
        )}
      </FormSpy>
    </TableStateProvider>
  );
};

export default CreateSCAPPolicyStep;
