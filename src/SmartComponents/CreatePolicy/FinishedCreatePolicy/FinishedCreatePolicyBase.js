import React, { useState, useEffect } from 'react';
import propTypes from 'prop-types';
import {
  Button,
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  EmptyStateIcon,
  List,
  ListItem,
  EmptyStateActions,
  EmptyStateHeader,
  EmptyStateFooter,
} from '@patternfly/react-core';
import {
  ProgressBar,
  LinkWithPermission as Link,
} from 'PresentationalComponents';
import { WrenchIcon } from '@patternfly/react-icons';
import { reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withApollo } from '@apollo/client/react/hoc';
import { dispatchNotification } from 'Utilities/Dispatcher';

const EmptyStateWithErrors = ({ errors }) =>
  errors && Array.isArray(errors) && errors.length > 0 ? (
    <EmptyStateBody className="wizard-failed-errors">
      <List>
        {errors.map((error) => (
          <ListItem key={error}>{error}</ListItem>
        ))}
      </List>
    </EmptyStateBody>
  ) : null;

EmptyStateWithErrors.propTypes = {
  errors: propTypes.array,
};

export const FinishedCreatePolicyBase = ({
  onWizardFinish,
  cloneFromProfileId,
  description,
  name,
  complianceThreshold,
  businessObjective,
  refId,
  benchmarkId,
  systems,
  selectedRuleRefIds,
  ruleValues: values,
  updatePolicy,
}) => {
  const [percent, setPercent] = useState(0);
  const [message, setMessage] = useState('This usually takes a minute or two.');
  const [errors, setErrors] = useState(null);
  const [failed, setFailed] = useState(false);

  const onProgress = (progress) => {
    setPercent(progress * 100);
  };

  const submitForm = () => {
    const newPolicy = {
      cloneFromProfileId,
      description,
      name,
      complianceThreshold,
      businessObjective: { title: businessObjective },
      refId,
      benchmarkId,
      hosts: systems,
      selectedRuleRefIds,
      values,
    };

    updatePolicy(null, newPolicy, onProgress)
      .then(({ id }) => {
        setPercent(100);
        setMessage();
        dispatchNotification({
          variant: 'success',
          title: `Created policy "${name}"`,
          autoDismiss: true,
          description: (
            <span>
              From the <strong>SCAP Policies</strong> list, open{' '}
              <Link to={`/scappolicies/${id}`}>{name}</Link>.
            </span>
          ),
        });
      })
      .catch((error) => {
        setMessage(error.networkError?.message);
        setErrors(error.networkError?.result?.errors);
        setFailed(true);
        dispatchNotification({
          variant: 'danger',
          title: 'Error creating policy',
          description: error.message,
        });
      });
  };

  useEffect(() => {
    submitForm();
  }, []);

  return (
    <Bullseye>
      <EmptyState variant={EmptyStateVariant.full}>
        <EmptyStateHeader
          titleText="Creating policy"
          icon={<EmptyStateIcon icon={WrenchIcon} />}
          headingLevel="h1"
        />
        <br />

        <EmptyStateBody>
          <ProgressBar percent={percent} failed={failed} />
        </EmptyStateBody>
        <EmptyStateFooter>
          <EmptyStateBody className={failed && 'wizard-failed-message'}>
            {message}
          </EmptyStateBody>
          <EmptyStateWithErrors errors={errors} />
          <EmptyStateActions>
            {(percent === 100 || failed) && (
              <Button
                variant={'primary'}
                ouiaId="ReturnToAppButton"
                onClick={() => {
                  onWizardFinish();
                }}
              >
                {failed ? 'Back' : 'Return to application'}
              </Button>
            )}
          </EmptyStateActions>
        </EmptyStateFooter>
      </EmptyState>
    </Bullseye>
  );
};

FinishedCreatePolicyBase.propTypes = {
  benchmarkId: propTypes.string.isRequired,
  businessObjective: propTypes.object,
  cloneFromProfileId: propTypes.string.isRequired,
  refId: propTypes.string.isRequired,
  name: propTypes.string.isRequired,
  description: propTypes.string,
  systems: propTypes.array,
  complianceThreshold: propTypes.number,
  onWizardFinish: propTypes.func,
  selectedRuleRefIds: propTypes.arrayOf(propTypes.string).isRequired,
  ruleValues: propTypes.object,
  updatePolicy: propTypes.func.isRequired,
};

export const selector = formValueSelector('policyForm');

export default compose(
  connect((state) => {
    return {
      benchmarkId: selector(state, 'benchmark'),
      businessObjective: selector(state, 'businessObjective'),
      cloneFromProfileId: selector(state, 'profile').id,
      refId: selector(state, 'refId'),
      name: selector(state, 'name'),
      description: selector(state, 'description'),
      complianceThreshold:
        parseFloat(selector(state, 'complianceThreshold')) || 100.0,
      systems: selector(state, 'systems'),
      selectedRuleRefIds: selector(state, 'selectedRuleRefIds'),
      ruleValues: selector(state, 'ruleValues'),
    };
  }),
  reduxForm({
    form: 'policyForm',
    destroyOnUnmount: true,
    forceUnregisterOnUnmount: true,
  }),
  withApollo
)(FinishedCreatePolicyBase);
