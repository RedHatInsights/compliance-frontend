import React from 'react';
import propTypes from 'prop-types';
import {
  Form,
  FormGroup,
  Text,
  TextContent,
  TextVariants,
  Tile,
} from '@patternfly/react-core';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import Spinner from '@redhat-cloud-services/frontend-components/Spinner';
import {
  propTypes as reduxFormPropTypes,
  formValueSelector,
  reduxForm,
} from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { StateViewPart, StateViewWithError } from 'PresentationalComponents';
import PolicyTypesTable from './Components/PolicyTypeTable';
import PolicyTypeTooltip from './Components/PolicyTypeTooltip';

const SUPPORTED_PROFILES = gql`
  query supportedProfilesByOSMajor {
    osMajorVersions {
      edges {
        node {
          osMajorVersion
          profiles {
            id
            name
            refId
            description
            complianceThreshold
            supportedOsVersions
            benchmark {
              id
              refId
              osMajorVersion
            }
          }
        }
      }
    }
    profiles(search: "external = false and canonical = false") {
      edges {
        node {
          id
          refId
          benchmark {
            refId
          }
        }
      }
    }
  }
`;

export const CreateSCAPPolicy = ({
  change,
  selectedProfile,
  selectedOsMajorVersion,
}) => {
  const { data, error, loading } = useQuery(SUPPORTED_PROFILES, {
    fetchPolicy: 'no-cache',
  });
  const inUseProfileRefIds = data?.profiles?.edges.map(
    ({ node: { refId } }) => refId
  );
  const osMajorVersions = data?.osMajorVersions?.edges.map(({ node }) => node);
  const selectedOsMajorVersionObject = osMajorVersions?.find(
    ({ osMajorVersion }) => osMajorVersion === selectedOsMajorVersion
  );
  const profilesToSelect = selectedOsMajorVersionObject?.profiles.map(
    (profile) => ({
      ...profile,
      disabled: inUseProfileRefIds.includes(profile.refId),
    })
  );

  return (
    <StateViewWithError stateValues={{ error, data, loading }}>
      <StateViewPart stateKey="loading">
        <Spinner />
      </StateViewPart>
      <StateViewPart stateKey="data">
        <TextContent>
          <Text component={TextVariants.h1} className="pf-u-mb-md">
            Create SCAP policy
          </Text>
          <Text className="pf-u-mb-md">
            Select the operating system and policy type for this policy.
          </Text>
        </TextContent>
        <Form>
          <FormGroup label="Operating system" isRequired fieldId="benchmark">
            {osMajorVersions &&
              osMajorVersions.map(({ osMajorVersion }) => (
                <Tile
                  key={`rhel${osMajorVersion}-select`}
                  className="pf-u-mr-md"
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
              labelIcon={<PolicyTypeTooltip />}
              label="Policy type"
              fieldId="policy-type"
            >
              <PolicyTypesTable
                aria-label="PolicyTypeTable"
                profiles={profilesToSelect}
                onChange={(policy) => {
                  change('profile', policy);
                  change('benchmark', policy.benchmark.id);
                  change('selectedRuleRefIds', undefined);
                }}
                selectedProfile={selectedProfile}
              />
            </FormGroup>
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

const selector = formValueSelector('policyForm');

export default compose(
  connect((state) => ({
    selectedProfile: selector(state, 'profile'),
    selectedOsMajorVersion: selector(state, 'osMajorVersion'),
  })),
  reduxForm({
    form: 'policyForm',
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
  })
)(CreateSCAPPolicy);
