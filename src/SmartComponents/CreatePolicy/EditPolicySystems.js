import React from 'react';
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
  WizardContextConsumer,
} from '@patternfly/react-core';
import { SystemsTable } from 'SmartComponents';
import { GET_SYSTEMS_WITH_POLICIES } from '../SystemsTable/constants';
import { compose } from 'redux';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { countOsMinorVersions } from 'Store/Reducers/SystemStore';
import * as Columns from '../SystemsTable/Columns';

// There should only be one component per file (rare exceptions exist)
const EmptyState = ({ osMajorVersion }) => (
  <React.Fragment>
    <TextContent className="pf-u-mb-md">
      <Text>
        You do not have any <b>RHEL {osMajorVersion}</b> systems connected to
        Insights and enabled for Compliance.
        <br />
        Policies must be created with at least one system.
      </Text>
    </TextContent>
    <TextContent className="pf-u-mb-md">
      <Text>
        Choose a different operating system, or connect{' '}
        <b>RHEL {osMajorVersion}</b> systems to Insights.
      </Text>
    </TextContent>
    <WizardContextConsumer>
      {({ goToStepById }) => (
        <Button onClick={() => goToStepById(1)}>
          Choose a different operating system
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
    <TextContent className="pf-u-mb-md">
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

export const EditPolicySystems = ({
  policy,
  change,
  osMajorVersion,
  selectedSystems,
}) => {
  const onSystemSelect = (newSelectedSystems) => {
    change('systems', newSelectedSystems);
    change('osMinorVersionCounts', countOsMinorVersions(newSelectedSystems));
  };
  const osMinorVersions = policy.supportedOsVersions.map(
    (version) => version.split('.')[1]
  );
  return (
    <React.Fragment>
      <TextContent className="pf-u-mb-md">
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
                sortBy: ['name'],
              },
              Columns.inventoryColumn('tags'),
              Columns.OperatingSystem,
            ]}
            remediationsEnabled={false}
            compact
            showActions={false}
            query={GET_SYSTEMS_WITH_POLICIES}
            defaultFilter={
              osMajorVersion &&
              `os_major_version = ${osMajorVersion} AND os_minor_version ^ (${osMinorVersions.join(
                ','
              )})`
            }
            enableExport={false}
            preselectedSystems={selectedSystems}
            onSelect={onSystemSelect}
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

EditPolicySystems.defaultProps = {
  selectedSystems: [],
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
