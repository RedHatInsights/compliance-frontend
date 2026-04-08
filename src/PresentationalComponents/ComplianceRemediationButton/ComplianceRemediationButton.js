import React, { useMemo } from 'react';
import propTypes from 'prop-types';
import { useAddNotification } from '@redhat-cloud-services/frontend-components-notifications/hooks';
import RemediationRemediationButton from '@redhat-cloud-services/frontend-components-remediations/RemediationButton';
import useIssuesFetch from './hooks/useIssuesFetch';
import FallbackButton from './components/FallBackButton';
import { getComplianceRemediationTooltipMessage } from './getComplianceRemediationTooltipMessage';

const ComplianceRemediationButton = ({
  reportId,
  reportTestResults,
  selectedRuleResultIds,
  ...buttonProps
}) => {
  const addNotification = useAddNotification();
  const { isLoading, fetchIssues, canFetch } = useIssuesFetch({
    reportId,
    reportTestResults: reportTestResults,
    selectedRuleResultIds,
  });

  const buttonTooltipContent = useMemo(
    () => getComplianceRemediationTooltipMessage(reportTestResults),
    [reportTestResults],
  );

  return (
    <RemediationRemediationButton
      isDisabled={reportTestResults?.length === 0 || !canFetch || isLoading}
      hasSelected={reportTestResults?.length > 0}
      buttonTooltipContent={buttonTooltipContent}
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
};

export default ComplianceRemediationButton;
