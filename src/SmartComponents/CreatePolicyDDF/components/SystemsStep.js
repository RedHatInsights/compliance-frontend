import React, { useCallback, useContext } from 'react';
import propTypes from 'prop-types';
import {
  useFormApi,
  FormSpy,
  wizardContext as WizardContext,
} from '@data-driven-forms/react-form-renderer';
import {
  Form,
  FormGroup,
  Content,
  ContentVariants,
  Button,
} from '@patternfly/react-core';
import { SystemsTable } from 'SmartComponents';
import { countOsMinorVersions } from 'Store/Reducers/SystemStore';
import * as Columns from 'SmartComponents/SystemsTable/Columns';

const EmptyState = ({ osMajorVersion, onGoToStep1 }) => {
  // TODO: Right now we allow to create policy with no systems. Decied what to show here.
  return (
    <React.Fragment>
      <Content className="pf-v6-u-mb-md">
        <Content component="p">
          You do not have any <b>RHEL {osMajorVersion}</b> systems connected to
          Red Hat Lightspeed and enabled for Compliance.
          <br />
          Policies must be created with at least one system.
        </Content>
      </Content>
      <Content className="pf-v6-u-mb-md">
        <Content component="p">
          Choose a different RHEL version , or connect{' '}
          <b>RHEL {osMajorVersion}</b> systems to Red Hat Lightspeed.
        </Content>
        <Button onClick={onGoToStep1}>Choose a different RHEL version</Button>
      </Content>
    </React.Fragment>
  );
};

EmptyState.propTypes = {
  osMajorVersion: propTypes.string,
  onGoToStep1: propTypes.func,
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

const SystemsStepContent = ({ profile, selectedSystems = [] }) => {
  const { change } = useFormApi();
  const { jumpToStep } = useContext(WizardContext);
  const osMajorVersion = profile?.os_major_version;

  const handleGoToStep1 = useCallback(() => {
    jumpToStep(0);
  }, [jumpToStep]);

  const onSelect = useCallback(
    (newSelectedSystems) => {
      change('systems', newSelectedSystems);
      change(
        'osMinorVersionCounts',
        countOsMinorVersions(newSelectedSystems, profile),
      );
    },
    [change, profile],
  );

  const defaultFilter =
    `os_major_version = ${osMajorVersion} AND ` +
    `os_minor_version ^ (${profile.os_minor_versions.join(' ')}) AND ` +
    `profile_ref_id !^ (${profile.ref_id})`;

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
              <PrependComponent osMajorVersion={osMajorVersion} />
            }
            emptyStateComponent={
              <EmptyState
                osMajorVersion={osMajorVersion}
                onGoToStep1={handleGoToStep1}
              />
            }
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

SystemsStepContent.propTypes = {
  profile: propTypes.object,
  selectedSystems: propTypes.array,
};

const SystemsStep = () => (
  <FormSpy subscription={{ values: true }}>
    {({ values }) => (
      <SystemsStepContent
        profile={values.profile}
        selectedSystems={values.systems}
      />
    )}
  </FormSpy>
);

export default SystemsStep;
