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
  Content,
  ContentVariants,
} from '@patternfly/react-core';
import { WizardContextConsumer } from '@patternfly/react-core/deprecated';
import { SystemsTable } from 'SmartComponents';
import { compose } from 'redux';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { countOsMinorVersions } from 'Store/Reducers/SystemStore';
import * as Columns from '../SystemsTable/Columns';

const EmptyState = ({ osMajorVersion }) => (
  <React.Fragment>
    <Content className="pf-v6-u-mb-md">
      <Content component="p">
        You do not have any <b>RHEL {osMajorVersion}</b> systems connected to
        Insights and enabled for Compliance.
        <br />
        Policies must be created with at least one system.
      </Content>
    </Content>
    <Content className="pf-v6-u-mb-md">
      <Content component="p">
        Choose a different RHEL version, or connect <b>RHEL {osMajorVersion}</b>{' '}
        systems to Insights.
      </Content>
    </Content>
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
    <Content className="pf-v6-u-mb-md">
      <Content component="p">
        Select which of your <b>RHEL {osMajorVersion}</b> systems should be
        included in this policy.
        <br />
        Systems can be added or removed at any time.
      </Content>
    </Content>
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
    [change, countOsMinorVersions],
  );

  return onSelect;
};

export const EditPolicySystems = ({
  profile,
  change,
  osMajorVersion,
  selectedSystems = [],
  allowNoSystems,
}) => {
  const onSelect = useOnSelect(change, countOsMinorVersions);
  const osMinorVersions = profile.supportedOsVersions.map(
    (version) => version.split('.')[1],
  );

  const defaultFilter = osMajorVersion
    ? `os_major_version = ${osMajorVersion} AND ` +
      `os_minor_version ^ (${osMinorVersions.join(' ')}) AND ` +
      `profile_ref_id !^ (${profile.ref_id})`
    : '';

  return (
    <React.Fragment>
      <Content className="pf-v6-u-mb-md">
        <Content component={ContentVariants.h1}>Systems</Content>
      </Content>
      <Form>
        <FormGroup>
          <SystemsTable
            apiEndpoint="systems"
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
            compact
            defaultFilter={defaultFilter}
            filters={{
              groups: true,
            }}
            preselectedSystems={selectedSystems.map(({ id }) => id)}
            onSelect={onSelect}
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
  }),
)(EditPolicySystems);
