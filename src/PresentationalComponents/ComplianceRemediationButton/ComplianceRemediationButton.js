import React from 'react';
import propTypes from 'prop-types';
import { useAddNotification } from '@redhat-cloud-services/frontend-components-notifications/hooks';
import RemediationRemediationButton from '@redhat-cloud-services/frontend-components-remediations/RemediationButton';
import useIssuesFetch from './hooks/useIssuesFetch';
import FallbackButton from './components/FallBackButton';

const ComplianceRemediationButton = ({
  reportId,
  reportTestResults,
  selectedRuleResultIds,
  onRemediationCreated,
  ...buttonProps
}) => {
  const addNotification = useAddNotification();
  const { isLoading, fetchIssues, canFetch } = useIssuesFetch({
    reportId,
    reportTestResults: reportTestResults,
    selectedRuleResultIds,
  });

  return (
    <RemediationRemediationButton
      isDisabled={reportTestResults?.length === 0 || !canFetch || isLoading}
      onRemediationCreated={(result) => {
        addNotification(result.getNotification());
      }}
      dataProvider={fetchIssues}
      buttonProps={{
        ouiaId: 'RemediateButton',
        isLoading,
      }}
      fallback={<FallbackButton />}
      {...buttonProps}
    >
      Plan remediation
    </RemediationRemediationButton>
  );
};

ComplianceRemediationButton.propTypes = {
  reportId: propTypes.string,
  reportTestResults: propTypes.arrayOf(propTypes.object),
  selectedRuleResultIds: propTypes.arrayOf(propTypes.string),
  onRemediationCreated: propTypes.func,
};

export default ComplianceRemediationButton;
