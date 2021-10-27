import React from 'react';
import propTypes from 'prop-types';
import SystemPolicyCards from '../../PresentationalComponents/SystemPolicyCards';
import RulesTable from '@/PresentationalComponents/RulesTable/RulesTable';
import ComplianceEmptyState from 'PresentationalComponents/ComplianceEmptyState';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';
import './compliance.scss';
import { ErrorCard } from 'PresentationalComponents';
import { IntlProvider } from 'react-intl';
import NoReportsState from './NoReportsState';
import NoPoliciesState from './NoPoliciesState';
import { BrowserRouter as Router } from 'react-router-dom';

const COMPLIANCE_API_ROOT = '/api/compliance';

const QUERY = gql`
  query System($systemId: String!) {
    system(id: $systemId) {
      id
      name
      hasPolicy
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
        ssgVersion
        majorOsVersion
        policy {
          id
        }
        rules {
          title
          severity
          rationale
          refId
          description
          compliant
          remediationAvailable
          references
          identifier
        }
      }
    }
  }
`;

const SystemQuery = ({ data: { system }, loading, hidePassed }) => (
  <React.Fragment>
    <SystemPolicyCards
      policies={system?.testResultProfiles}
      loading={loading}
    />
    <NoPoliciesState system={system} />
    <NoReportsState system={system} />
    <br />
    {system?.testResultProfiles?.length ? (
      <RulesTable
        remediationAvailableFilter
        handleSelect={() => undefined}
        hidePassed={hidePassed}
        system={{
          ...system,
          supported:
            (system?.testResultProfiles || []).filter(
              (profile) => profile.supported
            ).length > 0,
        }}
        profileRules={system?.testResultProfiles.map((profile) => ({
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
    ) : undefined}
  </React.Fragment>
);

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

const SystemDetails = ({ inventoryId, hidePassed, client }) => {
  let { data, error, loading } = useQuery(QUERY, {
    variables: { systemId: inventoryId },
    client,
    fetchPolicy: 'no-cache',
  });
  const is404 = error?.networkError?.statusCode === 404;

  if (loading) {
    return <Spinner />;
  }

  if (error && !is404) {
    const errorMsg = `Oops! Error loading System data: ${error}`;
    return <ErrorCard message={errorMsg} />;
  }

  return (
    <div className="ins-c-compliance__scope">
      {!data?.system || is404 ? (
        <ComplianceEmptyState title="No policies are reporting for this system" />
      ) : (
        <SystemQuery hidePassed={hidePassed} data={data} loading={loading} />
      )}
    </div>
  );
};

SystemDetails.propTypes = {
  inventoryId: propTypes.string,
  client: propTypes.object,
  hidePassed: propTypes.bool,
};

SystemDetails.defaultProps = {
  client: new ApolloClient({
    link: new HttpLink({
      uri: COMPLIANCE_API_ROOT + '/graphql',
      credentials: 'include',
    }),
    cache: new InMemoryCache(),
  }),
};

const WrappedSystemDetails = ({
  customItnl,
  customRouter,
  intlProps,
  ...props
}) => {
  const IntlWrapper = customItnl ? IntlProvider : React.Fragment;
  const RouterWrapper = customRouter ? Router : React.Fragment;

  return (
    <RouterWrapper>
      <IntlWrapper {...(customItnl && intlProps)}>
        <SystemDetails {...props} />
      </IntlWrapper>
    </RouterWrapper>
  );
};

WrappedSystemDetails.propTypes = {
  customItnl: propTypes.bool,
  intlProps: propTypes.any,
  customRouter: propTypes.bool,
};

export default WrappedSystemDetails;
