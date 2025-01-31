import React from 'react';
import propTypes from 'prop-types';
import { dispatchNotification } from 'Utilities/Dispatcher';
import { default as RemediationRemediationButton } from '@redhat-cloud-services/frontend-components-remediations/RemediationButton';
import { useIssuesFetch } from './hooks';
import FallbackButton from './components/FallBackButton';

const RemediationButton = ({
  reportId,
  reportTestResults,
  selectedRuleResultIds,
  onRemediationCreated,
  ...buttonProps
}) => {
  const { isLoading: isLoadingIssues, fetch } = useIssuesFetch(
    reportId,
    reportTestResults,
    selectedRuleResultIds
  );

  return (
    <RemediationRemediationButton
      isDisabled={reportTestResults?.length === 0 || isLoadingIssues}
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
  reportId: propTypes.string,
  reportTestResults: propTypes.arrayOf(propTypes.object),
  selectedRuleResultIds: propTypes.arrayOf(propTypes.string),
  onRemediationCreated: propTypes.func,
};

export default RemediationButton;
