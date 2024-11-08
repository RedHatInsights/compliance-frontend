import React from 'react';
import propTypes from 'prop-types';
import { Bullseye } from '@patternfly/react-core';
import ComplianceEmptyState from 'PresentationalComponents/ComplianceEmptyState';
import { useQuery } from '@apollo/client';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';
import './compliance.scss';
import { ErrorCard } from 'PresentationalComponents';
import useAPIV2FeatureFlag from '../../Utilities/hooks/useAPIV2FeatureFlag';
import SystemPoliciesAndRules from './SystemPoliciesAndRules';
import { SYSTEM_QUERY } from './constants';
import useTestResults from './useTestResults';
import SystemPoliciesAndRulesRest from './SystemPoliciesAndRulesRest';

export const DetailsRest = ({ inventoryId, hidePassed, ...props }) => {
  const { testResults, testResultsLoading } = useTestResults(inventoryId);

  return (
    <div className="ins-c-compliance__scope">
      {testResultsLoading ? (
        <Bullseye>
          <Spinner />
        </Bullseye>
      ) : testResults.length === 0 ? (
        // we render no policy cards nor rules table if there are no reporting policies
        <ComplianceEmptyState title="No policies are reporting for this system" />
      ) : (
        <SystemPoliciesAndRulesRest
          {...props}
          systemId={inventoryId}
          reportTestResults={testResults}
          hidePassed={hidePassed}
        />
      )}
    </div>
  );
};

DetailsRest.propTypes = {
  inventoryId: propTypes.string,
  hidePassed: propTypes.bool,
};

export const DetailsGraphQL = ({ inventoryId, hidePassed, ...props }) => {
  const { data, error, loading } = useQuery(SYSTEM_QUERY, {
    variables: { systemId: inventoryId },
    fetchPolicy: 'no-cache',
  });
  const is404 = error?.networkError?.statusCode === 404;

  if (loading) {
    return <Spinner />;
  }

  if (error && !is404) {
    // network errors other than 404 are unexpected
    return <ErrorCard />;
  }

  return (
    <div className="ins-c-compliance__scope">
      {!data?.system || is404 ? (
        <ComplianceEmptyState title="No policies are reporting for this system" />
      ) : (
        <SystemPoliciesAndRules
          {...props}
          hidePassed={hidePassed}
          data={data}
          loading={loading}
        />
      )}
    </div>
  );
};

DetailsGraphQL.propTypes = {
  inventoryId: propTypes.string,
  hidePassed: propTypes.bool,
};

export const Details = (props) => {
  const apiV2Enabled = useAPIV2FeatureFlag();

  return apiV2Enabled === undefined ? (
    <Bullseye>
      <Spinner />
    </Bullseye>
  ) : apiV2Enabled ? (
    <DetailsRest {...props} />
  ) : (
    <DetailsGraphQL {...props} />
  );
};

Details.propTypes = {
  inventoryId: propTypes.string,
  hidePassed: propTypes.bool,
};

export default Details;
