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

const BENCHMARKS_AND_PROFILES = gql`
  query benchmarksAndProfiles {
    latestBenchmarks {
      id
      title
      refId
      version
      osMajorVersion
      profiles {
        id
        name
        refId
        description
        complianceThreshold
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

const PolicyTooltip = () => (
  <Tooltip
    position="right"
    content="Policy types are OpenSCAP policies that are supported by RHEL.
        For each major version of RHEL, users can create one policy of each type."
  >
    <OutlinedQuestionCircleIcon className="grey-icon" />
  </Tooltip>
);

export const CreateSCAPPolicy = ({
  change,
  selectedBenchmarkId,
  selectedProfile,
}) => {
  const { data, error, loading } = useQuery(BENCHMARKS_AND_PROFILES, {
    fetchPolicy: 'no-cache',
  });

  const inUseProfileRefIds = (profiles, benchmark) =>
    profiles
      .filter((profile) => benchmark.refId === profile.node.benchmark.refId)
      .map((profile) => profile.node.refId);

  if (error) {
    return error;
  }

  if (loading) {
    return <Spinner />;
  }

  const benchmarks = data.latestBenchmarks;
  let selectedBenchmark;
  let validProfiles;
  if (selectedBenchmarkId) {
    selectedBenchmark = benchmarks.find(
      (benchmark) => benchmark.id === selectedBenchmarkId
    );
    const userProfileRefIds = inUseProfileRefIds(
      data.profiles.edges,
      selectedBenchmark
    );
    validProfiles = selectedBenchmark.profiles.map((profile) => ({
      ...profile,
      disabled: userProfileRefIds.includes(profile.refId),
    }));
  }

  const setBenchmark = ({ id, osMajorVersion }) => {
    if (selectedBenchmark?.osMajorVersion !== osMajorVersion) {
      change('systems', []);
    }

    change('benchmark', id);
    change('osMajorVersion', osMajorVersion);
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
        <FormGroup label="Operating system" isRequired fieldId="benchmark">
          {benchmarks &&
            benchmarks
              .sort((a, b) => a.refId.localeCompare(b.refId))
              .map((benchmark) => {
                const { id, osMajorVersion } = benchmark;
                return (
                  <Tile
                    key={id}
                    className="pf-u-mr-md"
                    title={`RHEL ${osMajorVersion}`}
                    onClick={() => setBenchmark(benchmark)}
                    isSelected={selectedBenchmarkId === id}
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
            profiles={selectedBenchmark && validProfiles}
            onChange={(value) => {
              change('selectedRuleRefIds', undefined);
              change('profile', value);
            }}
            selectedProfile={selectedProfile}
          />
        </FormGroup>
      </Form>
    </React.Fragment>
  );
};

CreateSCAPPolicy.propTypes = {
  selectedBenchmarkId: propTypes.string,
  change: reduxFormPropTypes.change,
  selectedProfile: propTypes.object,
};

const selector = formValueSelector('policyForm');

export default compose(
  connect((state) => ({
    selectedBenchmarkId: selector(state, 'benchmark'),
    selectedProfile: selector(state, 'profile'),
  })),
  reduxForm({
    form: 'policyForm',
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
  })
)(CreateSCAPPolicy);
