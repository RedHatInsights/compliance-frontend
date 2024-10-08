import React from 'react';
import propTypes from 'prop-types';
import { propTypes as reduxFormPropTypes } from 'redux-form';
import {
  Bullseye,
  Form,
  FormGroup,
  Spinner,
  Text,
  TextContent,
  TextVariants,
  Tile,
} from '@patternfly/react-core';
import { StateViewPart, StateViewWithError } from 'PresentationalComponents';
import PolicyTypesTable from '../Components/PolicyTypeTable';
import PolicyTypeTooltip from '../Components/PolicyTypeTooltip';

export const CreateSCAPPolicyBase = ({
  selectedOsMajorVersion,
  selectedProfile,
  data,
  availableOsMajorVersionsLoading,
  availableProfilesLoading,
  error,
  change,
}) => {
  return (
    <StateViewWithError
      stateValues={{ error, data, loading: availableOsMajorVersionsLoading }}
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
            availableProfilesLoading ? (
              <Bullseye>
                <Spinner />
              </Bullseye>
            ) : (
              <FormGroup
                isRequired
                labelIcon={<PolicyTypeTooltip />}
                label="Policy type"
                fieldId="policy-type"
              >
                <PolicyTypesTable
                  profiles={data?.availableProfiles || []}
                  onChange={(policy) => {
                    change('profile', policy);
                    change('benchmark', policy.benchmark.id);
                    change('selectedRuleRefIds', undefined);
                    change('systems', []);
                  }}
                  selectedProfile={selectedProfile}
                />
              </FormGroup>
            )
          ) : (
            <React.Fragment />
          )}
        </Form>
      </StateViewPart>
    </StateViewWithError>
  );
};

CreateSCAPPolicyBase.propTypes = {
  selectedOsMajorVersion: propTypes.string,
  selectedProfile: propTypes.object,
  data: propTypes.shape({
    availableOsMajorVersions: propTypes.array,
    availableProfiles: propTypes.array,
  }),
  availableOsMajorVersionsLoading: propTypes.bool,
  availableProfilesLoading: propTypes.bool,
  error: propTypes.object,
  change: reduxFormPropTypes.change,
};

export default CreateSCAPPolicyBase;
