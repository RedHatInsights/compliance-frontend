import React from 'react';
import propTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  formValueSelector,
  reduxForm,
  propTypes as reduxFormPropTypes,
} from 'redux-form';
import {
  Form,
  FormGroup,
  Spinner,
  Text,
  TextContent,
  TextVariants,
  Tile,
} from '@patternfly/react-core';
import TableStateProvider from '@/Frameworks/AsyncTableTools/components/TableStateProvider';
import useSupportedProfiles from 'Utilities/hooks/api/useSupportedProfiles';
import useSecurityGuidesOS from 'Utilities/hooks/api/useSecurityGuidesOS';
import { StateViewPart, StateViewWithError } from 'PresentationalComponents';
import PolicyTypesTable from '../Components/PolicyTypeTable';
import PolicyTypeTooltip from '../Components/PolicyTypeTooltip';

const serialiseOsVersions = (profiles = []) =>
  profiles.map((profile) => ({
    ...profile,
    supportedOsVersions: profile.os_minor_versions.map(
      (minorVersion) => `${profile.os_major_version}.${minorVersion}`
    ),
  }));

const CreateSCAPPolicy = ({
  selectedOsMajorVersion,
  selectedProfile,
  change,
}) => {
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
      filter: `os_major_version=${selectedOsMajorVersion}`,
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
        <TextContent>
          <Text component={TextVariants.h1} className="pf-v5-u-mb-md">
            Create SCAP policy
          </Text>
          <Text className="pf-v5-u-mb-md">
            Select the operating system and policy type for this policy.
          </Text>
        </TextContent>
        <Form>
          <FormGroup label="Operating system" isRequired fieldId="benchmark">
            {(data?.availableOsMajorVersions || []).map((osMajorVersion) => (
              <Tile
                key={`rhel${osMajorVersion}-select`}
                className="pf-v5-u-mr-md"
                title={`RHEL ${osMajorVersion}`}
                onClick={() => {
                  change('osMajorVersion', osMajorVersion);
                }}
                isSelected={selectedOsMajorVersion === osMajorVersion}
                isStacked
              />
            ))}
          </FormGroup>
          {selectedOsMajorVersion ? (
            <FormGroup
              isRequired
              labelIcon={<PolicyTypeTooltip />}
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
          ) : (
            <React.Fragment />
          )}
        </Form>
      </StateViewPart>
    </StateViewWithError>
  );
};

CreateSCAPPolicy.propTypes = {
  change: reduxFormPropTypes.change,
  selectedProfile: propTypes.object,
  selectedOsMajorVersion: propTypes.string,
};

const CreateSCAPPolicyTableStateProvider = (props) => {
  return (
    <TableStateProvider>
      <CreateSCAPPolicy {...props} />
    </TableStateProvider>
  );
};

const selector = formValueSelector('policyForm');

const CreateSCAPPolicyWithRedux = compose(
  connect((state) => ({
    selectedProfile: selector(state, 'profile'),
    selectedOsMajorVersion: selector(state, 'osMajorVersion'),
  })),
  reduxForm({
    form: 'policyForm',
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
  })
)(CreateSCAPPolicyTableStateProvider);

export { CreateSCAPPolicyWithRedux, CreateSCAPPolicyTableStateProvider };
