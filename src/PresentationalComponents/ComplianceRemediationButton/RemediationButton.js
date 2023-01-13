import React from 'react';
import propTypes from 'prop-types';
import { dispatchNotification } from 'Utilities/Dispatcher';
import { default as RemediationRemediationButton } from '@redhat-cloud-services/frontend-components-remediations/RemediationButton';
import { useIssuesFetch } from './hooks';
import FallbackButton from './components/FallBackButton';

const RemediationButton = ({
  rules,
  systems,
  policyId,
  onRemediationCreated,
  ...buttonProps
}) => {
  const { isLoading: isLoadingIssues, fetch } = useIssuesFetch(
    policyId,
    rules,
    systems
  );

  return (
    <RemediationRemediationButton
      isDisabled={systems?.length === 0 || isLoadingIssues}
      onRemediationCreated={(result) => {
        dispatchNotification(result.getNotification());
      }}
      dataProvider={fetch}
      buttonProps={{
        ouiaId: 'RemediateButton',
        isLoading: isLoadingIssues,
      }}
      fallback={<FallbackButton />}
      {...buttonProps}
    >
      Remediate
    </RemediationRemediationButton>
  );
};

RemediationButton.propTypes = {
  rules: propTypes.array,
  systems: propTypes.array,
  onRemediationCreated: propTypes.func,
  policyId: propTypes.string,
};

export default RemediationButton;
