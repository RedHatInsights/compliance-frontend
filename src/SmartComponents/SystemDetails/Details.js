import React from 'react';
import propTypes from 'prop-types';
import { Bullseye } from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';
import './compliance.scss';
import useTestResults from './useTestResults';
import SystemPoliciesAndRules from './SystemPoliciesAndRules';
import EmptyState from './EmptyState';

export const Details = ({ inventoryId, hidePassed, system, ...props }) => {
  const { testResults, testResultsLoading } = useTestResults(inventoryId);

  return (
    <div className="ins-c-compliance__scope">
      {testResultsLoading ? (
        <Bullseye>
          <Spinner />
        </Bullseye>
      ) : testResults.length === 0 ? (
        // we render no policy cards nor rules table if there are no reporting policies
        <EmptyState inventoryId={inventoryId} system={system} />
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
};

export default Details;
