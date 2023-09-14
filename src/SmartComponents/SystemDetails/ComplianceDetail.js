import React, { useState } from 'react';
import propTypes from 'prop-types';
import { Tabs, Tab, TabTitleText } from '@patternfly/react-core';
import SystemPolicyCards from '../../PresentationalComponents/SystemPolicyCards';
import RulesTable from '@/PresentationalComponents/RulesTable/RulesTable';
import ComplianceEmptyState from 'PresentationalComponents/ComplianceEmptyState';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';
import './compliance.scss';
import { ErrorCard } from 'PresentationalComponents';

import EmptyState from './EmptyState';

const QUERY = gql`
  query CD_System($systemId: String!) {
    system(id: $systemId) {
      id
      name
      hasPolicy
      insightsId
      policies {
        id
      }
      testResultProfiles {
        id
        name
        policyType
        refId
        compliant
        rulesFailed
        rulesPassed
        lastScanned
        score
        supported
        osMajorVersion
        benchmark {
          version
          ruleTree
        }
        policy {
          id
        }
        rules {
          id
          title
          severity
          rationale
          refId
          description
          compliant
          remediationAvailable
          references
          identifier
          precedence
        }
      }
    }
  }
`;

const SystemQuery = ({ data: { system }, loading, hidePassed }) => {
  const [selectedPolicy, setSelectedPolicy] = useState(
    system.testResultProfiles[0]?.id
  );
  const policies = system?.testResultProfiles;

  return (
    <>
      <SystemPolicyCards policies={policies} loading={loading} />
      <br />
      {system?.testResultProfiles?.length ? (
        <>
          {system.testResultProfiles.length > 1 && (
            <Tabs
              activeKey={selectedPolicy}
              style={{ background: 'var(--pf-global--BackgroundColor--100)' }}
            >
              {system.testResultProfiles.map((policy, idx) => {
                return (
                  <Tab
                    key={'policy-tab-' + idx}
                    eventKey={policy.id}
                    title={<TabTitleText> {policy.name} </TabTitleText>}
                    onClick={() => {
                      setSelectedPolicy(policy.id);
                    }}
                  />
                );
              })}
            </Tabs>
          )}
          <RulesTable
            ansibleSupportFilter
            hidePassed={hidePassed}
            showFailedCounts
            system={{
              ...system,
              supported:
                (system?.testResultProfiles || []).filter(
                  (profile) => profile.supported
                ).length > 0,
            }}
            profileRules={system?.testResultProfiles
              .filter((policy) => selectedPolicy === policy.id)
              .map((profile) => ({
                system,
                profile,
                rules: profile.rules,
              }))}
            loading={loading}
            options={{
              sortBy: {
                index: 4,
                direction: 'asc',
                property: 'severity',
              },
            }}
          />
        </>
      ) : (
        <EmptyState system={system} />
      )}
    </>
  );
};

SystemQuery.propTypes = {
  data: propTypes.shape({
    system: propTypes.shape({
      hasPolicy: propTypes.bool,
      policies: propTypes.shape({
        id: propTypes.string,
      }),
      profiles: propTypes.array,
      testResultProfiles: propTypes.array,
    }),
  }),
  loading: propTypes.bool,
  hidePassed: propTypes.bool,
};

SystemQuery.defaultProps = {
  loading: true,
};

export const Details = ({ inventoryId, hidePassed, ...props }) => {
  const { data, error, loading } = useQuery(QUERY, {
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
        <SystemQuery
          {...props}
          hidePassed={hidePassed}
          data={data}
          loading={loading}
        />
      )}
    </div>
  );
};

Details.propTypes = {
  inventoryId: propTypes.string,
  hidePassed: propTypes.bool,
};

export default Details;
