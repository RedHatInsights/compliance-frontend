import React from 'react';
import propTypes from 'prop-types';
import { CenteredSpinner } from 'PresentationalComponents';
import './compliance.scss';
import useTestResults from './useTestResults';
import SystemPoliciesAndRules from './SystemPoliciesAndRules';
import EmptyState from './EmptyState';

export const Details = ({
  inventoryId,
  hidePassed,
  system,
  connectedToInsights,
  ...props
}) => {
  const { testResults, testResultsLoading } = useTestResults(inventoryId, {
    skip: connectedToInsights === false,
  });

  return (
    <div className="ins-c-compliance__scope">
      {testResultsLoading && connectedToInsights !== false ? (
        <CenteredSpinner />
      ) : testResults?.length === 0 || connectedToInsights === false ? (
        <EmptyState
          inventoryId={inventoryId}
          system={system}
          connectedToInsights={connectedToInsights}
        />
      ) : (
        <SystemPoliciesAndRules
          {...props}
          systemId={inventoryId}
          reportTestResults={testResults}
          hidePassed={hidePassed}
        />
      )}
    </div>
  );
};

Details.propTypes = {
  inventoryId: propTypes.string,
  hidePassed: propTypes.bool,
  system: propTypes.object,
  connectedToInsights: propTypes.bool,
};

export default Details;
