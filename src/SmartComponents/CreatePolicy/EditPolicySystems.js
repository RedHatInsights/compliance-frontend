import React, { useEffect, useCallback } from 'react';
import {
  propTypes as reduxFormPropTypes,
  reduxForm,
  formValueSelector,
} from 'redux-form';
import {
  Button,
  Form,
  FormGroup,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import { WizardContextConsumer } from '@patternfly/react-core/deprecated';
import { SystemsTable } from 'SmartComponents';
import { compose } from 'redux';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { countOsMinorVersions } from 'Store/Reducers/SystemStore';
import * as Columns from '../SystemsTable/Columns';
import { apiInstance } from '@/Utilities/hooks/useQuery';
import { buildOSObject } from '../../Utilities/helpers';
import { fetchSystemsApi } from 'SmartComponents/SystemsTable/constants';

const EmptyState = ({ osMajorVersion }) => (
  <React.Fragment>
    <TextContent className="pf-v5-u-mb-md">
      <Text>
        You do not have any <b>RHEL {osMajorVersion}</b> systems connected to
        Insights and enabled for Compliance.
        <br />
        Policies must be created with at least one system.
      </Text>
    </TextContent>
    <TextContent className="pf-v5-u-mb-md">
      <Text>
        Choose a different RHEL version, or connect <b>RHEL {osMajorVersion}</b>{' '}
        systems to Insights.
      </Text>
    </TextContent>
    <WizardContextConsumer>
      {({ goToStepById }) => (
        <Button onClick={() => goToStepById(1)}>
          Choose a different RHEL version
        </Button>
      )}
    </WizardContextConsumer>
  </React.Fragment>
);

EmptyState.propTypes = {
  osMajorVersion: propTypes.string,
};

const PrependComponent = ({ osMajorVersion }) => (
  <React.Fragment>
    <TextContent className="pf-v5-u-mb-md">
      <Text>
        Select which of your <b>RHEL {osMajorVersion}</b> systems should be
        included in this policy.
        <br />
        Systems can be added or removed at any time.
      </Text>
    </TextContent>
  </React.Fragment>
);

PrependComponent.propTypes = {
  osMajorVersion: propTypes.string,
};

const useOnSelect = (change, countOsMinorVersions) => {
  const onSelect = useCallback(
    (newSelectedSystems) => {
      change('systems', newSelectedSystems);
      change('osMinorVersionCounts', countOsMinorVersions(newSelectedSystems));
    },
    [change, countOsMinorVersions]
  );

  return onSelect;
};

export const EditPolicySystems = ({
  profile,
  change,
  osMajorVersion,
  osMinorVersionCounts,
  selectedSystems = [],
  allowNoSystems,
}) => {
  const onSelect = useOnSelect(change, countOsMinorVersions);
  const osMinorVersions = profile.supportedOsVersions.map(
    (version) => version.split('.')[1]
  );

  const defaultFilter = osMajorVersion
    ? `os_major_version = ${osMajorVersion} AND ` +
      `os_minor_version ^ (${osMinorVersions.join(' ')}) AND ` +
      `profile_ref_id !^ (${profile.ref_id})`
    : '';

  const fetchCustomOSes = ({ filters: defaultFilter }) =>
    apiInstance.systemsOS(null, defaultFilter).then(({ data }) => {
      return {
        results: buildOSObject(data),
        total: data?.length || 0,
      };
    });

  useEffect(() => {
    if (!osMinorVersionCounts || !osMinorVersionCounts.length) {
      change(
        'osMinorVersionCounts',
        profile.supportedOsVersions.map((version) => ({
          osMinorVersion: version.split('.')[1],
          count: 0,
        }))
      );
    }
  }, [profile, osMinorVersionCounts, change]);

  return (
    <React.Fragment>
      <TextContent className="pf-v5-u-mb-md">
        <Text component={TextVariants.h1}>Systems</Text>
      </TextContent>
      <Form>
        <FormGroup>
          <SystemsTable
            showOsMinorVersionFilter={[osMajorVersion]}
            prependComponent={
              allowNoSystems ? undefined : (
                <PrependComponent osMajorVersion={osMajorVersion} />
              )
            }
            emptyStateComponent={<EmptyState osMajorVersion={osMajorVersion} />}
            columns={[
              {
                ...Columns.Name,
                props: {
                  width: 40,
                },
                sortBy: ['display_name'],
              },
              Columns.inventoryColumn('groups', {
                requiresDefault: true,
                sortBy: ['groups'],
              }),
              Columns.inventoryColumn('tags'),
              Columns.OperatingSystem(),
            ]}
            remediationsEnabled={false}
            compact
            showActions={false}
            defaultFilter={defaultFilter}
            enableExport={false}
            preselectedSystems={selectedSystems.map(({ id }) => id)}
            onSelect={onSelect}
            showGroupsFilter
            fetchApi={fetchSystemsApi}
            fetchCustomOSes={fetchCustomOSes}
          />
        </FormGroup>
      </Form>
    </React.Fragment>
  );
};

EditPolicySystems.propTypes = {
  osMajorVersion: propTypes.string,
  profile: propTypes.object,
  osMinorVersionCounts: propTypes.array,
  selectedSystems: propTypes.array,
  change: reduxFormPropTypes.change,
  allowNoSystems: propTypes.bool,
};

const selector = formValueSelector('policyForm');
const mapStateToProps = (state) => ({
  profile: selector(state, 'profile'),
  osMajorVersion: selector(state, 'osMajorVersion'),
  osMinorVersionCounts: selector(state, 'osMinorVersionCounts'),
  selectedSystems: selector(state, 'systems'),
});

export default compose(
  connect(mapStateToProps),
  reduxForm({
    form: 'policyForm',
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
  })
)(EditPolicySystems);
