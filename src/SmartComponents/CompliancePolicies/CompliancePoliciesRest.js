import React from 'react';
import { Grid } from '@patternfly/react-core';
import { ErrorPage, PoliciesTable } from '../../PresentationalComponents';
import dataSerialiser from '../../Utilities/dataSerialiser';
import useHasNoPolicies from '../../Utilities/hooks/useHasNoPolicies';
import { apiInstance } from '../../Utilities/hooks/useQuery';
import useComplianceQuery from '../../Utilities/hooks/useQuery/useComplianceQuery';
import { CreateLink, dataMap } from './constants';
import ComplianceEmptyState from '../../PresentationalComponents/ComplianceEmptyState';

const CompliancePoliciesRest = () => {
  const { data, loading, error } = useComplianceQuery(apiInstance.policies);

  let policies = data?.data?.map((policy) => dataSerialiser(policy, dataMap));

  const showEmptyState = useHasNoPolicies();

  return (
    <>
      {!error ? (
        <>
          {showEmptyState ? (
            <Grid hasGutter>
              <ComplianceEmptyState
                title="No policies"
                mainButton={<CreateLink />}
              />
            </Grid>
          ) : (
            <PoliciesTable
              policies={policies}
              options={{
                firstAction: <CreateLink />,
                numberOfItems: data?.meta?.total ?? 0,
                loading: loading,
              }}
            />
          )}
        </>
      ) : (
        <ErrorPage error={error} />
      )}
    </>
  );
};

export default CompliancePoliciesRest;
