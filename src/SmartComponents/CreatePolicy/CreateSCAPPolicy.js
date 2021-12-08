import React from 'react';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import {
  Form,
  FormGroup,
  Text,
  TextContent,
  TextVariants,
  Tile,
  Tooltip,
} from '@patternfly/react-core';
import { ProfileTypeSelect } from 'PresentationalComponents';
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
import propTypes from 'prop-types';

const SUPPORTED_PROFILES_BY_OS_MAJOR = gql`
  query supportedProfilesByOSMajor {
    osMajorVersions {
      edges {
        node {
          osMajorVersion
          supportedProfiles {
            id
            name
            refId
            description
            complianceThreshold
            benchmark {
              id
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
            osMajorVersion
          }
        }
      }
    }
  }
`;

const PolicyTooltip = () => (
  <Tooltip
    position="right"
    content="Policy types are OpenSCAP policies that are supported by RHEL.
        For each major version of RHEL, users can create one policy of each type."
  >
    <OutlinedQuestionCircleIcon className="grey-icon" />
  </Tooltip>
);

export const CreateSCAPPolicy = ({ change, selectedOs, selectedProfile }) => {
  const { data, error, loading } = useQuery(SUPPORTED_PROFILES_BY_OS_MAJOR, {
    fetchPolicy: 'no-cache',
  });

  const inUseProfileRefIds = (profiles, osMajorVersion) =>
    profiles
      .filter(
        (profile) => osMajorVersion == profile.node.benchmark.osMajorVersion
      )
      .map((profile) => profile.node.refId);

  if (error) {
    return error;
  }

  if (loading) {
    return <Spinner />;
  }

  const osMajorVersions = data.osMajorVersions?.edges;
  let selectedOsMajorVersion;
  let validProfiles;
  if (selectedOs) {
    selectedOsMajorVersion = osMajorVersions.find(
      (os) => os.node.osMajorVersion === selectedOs
    );
    const userProfileRefIds = inUseProfileRefIds(
      data.profiles.edges,
      selectedOs
    );
    validProfiles = selectedOsMajorVersion?.node.supportedProfiles.map(
      (profile) => ({
        ...profile,
        disabled: userProfileRefIds.includes(profile.refId),
      })
    );
  }

  const setOsMajorVerson = (osMajorVersion) => {
    if (selectedOs !== osMajorVersion.node.osMajorVersion) {
      change('systems', []);
    }

    change('osMajorVersion', osMajorVersion.node.osMajorVersion);
  };

  return (
    <React.Fragment>
      <TextContent>
        <Text component={TextVariants.h1} className="pf-u-mb-md">
          Create SCAP policy
        </Text>
        <Text className="pf-u-mb-md">
          Select the operating system and policy type for this policy.
        </Text>
      </TextContent>
      <Form>
        <FormGroup label="Operating system" isRequired fieldId="osMajorVersion">
          {osMajorVersions &&
            osMajorVersions.map((os) => {
              const osMajorVersion = os.node.osMajorVersion;
              return (
                <Tile
                  key={osMajorVersion}
                  className="pf-u-mr-md"
                  title={`RHEL ${osMajorVersion}`}
                  onClick={() => setOsMajorVerson(os)}
                  isSelected={selectedOs === osMajorVersion}
                  isStacked
                />
              );
            })}
        </FormGroup>
        <FormGroup
          isRequired
          labelIcon={<PolicyTooltip />}
          label="Policy type"
          fieldId="policy-type"
        >
          <ProfileTypeSelect
            profiles={selectedOs && validProfiles}
            onChange={(value) => {
              change('selectedRuleRefIds', undefined);
              change('profile', value);
              change('benchmark', JSON.parse(value).benchmark.id);
            }}
            selectedProfile={selectedProfile}
          />
        </FormGroup>
      </Form>
    </React.Fragment>
  );
};

CreateSCAPPolicy.propTypes = {
  selectedOs: propTypes.number,
  change: reduxFormPropTypes.change,
  selectedProfile: propTypes.object,
};

const selector = formValueSelector('policyForm');

export default compose(
  connect((state) => ({
    selectedOs: selector(state, 'osMajorVersion'),
    selectedProfile: selector(state, 'profile'),
  })),
  reduxForm({
    form: 'policyForm',
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
  })
)(CreateSCAPPolicy);
