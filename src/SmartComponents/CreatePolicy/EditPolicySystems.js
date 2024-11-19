import React, { useCallback } from 'react';
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
import useAPIV2FeatureFlag from '../../Utilities/hooks/useAPIV2FeatureFlag';
import { fetchApi } from '../ComplianceSystems/ComplianceSystems';
import { apiInstance } from '@/Utilities/hooks/useQuery';
import { buildOSObject } from '../../Utilities/helpers';

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
  policy,
  change,
  osMajorVersion,
  selectedSystems = [],
}) => {
  const apiV2Enabled = useAPIV2FeatureFlag();
  const onSelect = useOnSelect(change, countOsMinorVersions);
  const osMinorVersions = policy.supportedOsVersions.map(
    (version) => version.split('.')[1]
  );

  const defaultFilter = osMajorVersion
    ? apiV2Enabled
      ? `os_major_version = ${osMajorVersion} AND os_minor_version ^ (${osMinorVersions.join(
          ' '
        )}) AND profile_ref_id !^ (${policy.refId})`
      : `os_major_version = ${osMajorVersion} AND os_minor_version ^ (${osMinorVersions.join(
          ','
        )})`
    : '';

  const fetchCustomOSes = ({ filters: defaultFilter }) =>
    apiInstance.systemsOS(null, defaultFilter).then(({ data }) => {
      return {
        results: buildOSObject(data),
        total: data?.length || 0,
      };
    });

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
              <PrependComponent osMajorVersion={osMajorVersion} />
            }
            emptyStateComponent={<EmptyState osMajorVersion={osMajorVersion} />}
            columns={[
              {
                ...Columns.Name,
                props: {
                  width: 40,
                },
                sortBy: apiV2Enabled ? ['display_name'] : ['name'],
              },
              Columns.inventoryColumn('groups', {
                requiresDefault: true,
                sortBy: ['groups'],
              }),
              Columns.inventoryColumn('tags'),
              Columns.OperatingSystem(apiV2Enabled),
            ]}
            remediationsEnabled={false}
            compact
            showActions={false}
            defaultFilter={defaultFilter}
            enableExport={false}
            preselectedSystems={selectedSystems.map(({ id }) => id)}
            onSelect={onSelect}
            showGroupsFilter
            apiV2Enabled={apiV2Enabled}
            fetchApi={fetchApi}
            fetchCustomOSes={fetchCustomOSes}
          />
        </FormGroup>
      </Form>
    </React.Fragment>
  );
};

EditPolicySystems.propTypes = {
  osMajorVersion: propTypes.string,
  policy: propTypes.object,
  selectedSystems: propTypes.array,
  change: reduxFormPropTypes.change,
};

const selector = formValueSelector('policyForm');
const mapStateToProps = (state) => ({
  policy: selector(state, 'profile'),
  osMajorVersion: selector(state, 'osMajorVersion'),
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
