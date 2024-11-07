import React from 'react';
import propTypes from 'prop-types';
import { dispatchNotification } from 'Utilities/Dispatcher';
import { default as RemediationRemediationButton } from '@redhat-cloud-services/frontend-components-remediations/RemediationButton';
import { useIssuesFetchRest } from './hooks';
import FallbackButton from './components/FallBackButton';

const RemediationButtonRest = ({
  reportId,
  wholeSystems,
  onRemediationCreated,
  ...buttonProps
}) => {
  const { isLoading: isLoadingIssues, fetch } = useIssuesFetchRest(
    reportId,
    wholeSystems
  );

  return (
    <RemediationRemediationButton
      isDisabled={wholeSystems?.length === 0 || isLoadingIssues}
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

RemediationButtonRest.propTypes = {
  reportId: propTypes.string,
  systems: propTypes.array,
  wholeSystems: propTypes.array,
  onRemediationCreated: propTypes.func,
};

export default RemediationButtonRest;
