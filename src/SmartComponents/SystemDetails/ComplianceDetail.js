import React, { useState } from 'react';
import propTypes from 'prop-types';
import SystemPolicyCards from '../../PresentationalComponents/SystemPolicyCards';
import RulesTable from '@/PresentationalComponents/RulesTable/RulesTable';
import ComplianceEmptyState from 'PresentationalComponents/ComplianceEmptyState';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost';
import { ApolloProvider } from '@apollo/client';

import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';
import './compliance.scss';
import { ErrorCard } from 'PresentationalComponents';
import { IntlProvider } from 'react-intl';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { init } from 'Store';
import EmptyState from './EmptyState';

const COMPLIANCE_API_ROOT = '/api/compliance';

//Question: what is testResultProfiles? why there is overlapping same policy query?
const QUERY = gql`
  query System($systemId: String!) {
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
        }
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
          precedence
        }
      }
    }
  }
`;

const SystemQuery = ({ data: { system }, loading, hidePassed }) => {
  const [selectedPolicies, setSelectedPolicies] = useState();
  const policies = system?.testResultProfiles;
  const setOrUnsetPolicy = (policy) => {
    if (!policy) {
      return;
    }
    const policyIncluded = selectedPolicies?.find(
      (policyId) => policy?.id === policyId
    );
    if (policyIncluded) {
      const newSelection = selectedPolicies?.filter(
        (policyId) => policy.id !== policyId
      );
      setSelectedPolicies(newSelection.length > 0 ? newSelection : undefined);
    } else {
      setSelectedPolicies([...(selectedPolicies || []), policy?.id]);
    }
  };

  const onDeleteFilter = (chips, clearAll) => {
    const chipNames = chips
      .find((chips) => chips.category === 'Policy')
      ?.chips.map((chip) => chip.name);
    const policyId = policies.find(({ name }) => chipNames?.includes(name))?.id;

    if (policyId) {
      !clearAll
        ? setOrUnsetPolicy(
            policyId
              ? {
                  id: policyId,
                }
              : {}
          )
        : setSelectedPolicies(undefined);
    }
  };

  return (
    <>
      <SystemPolicyCards
        policies={policies}
        loading={loading}
        selectedPolicies={selectedPolicies}
        onCardClick={(policy) => {
          setOrUnsetPolicy(policy);
        }}
      />
      <br />
      {system?.testResultProfiles?.length ? (
        <RulesTable
          ansibleSupportFilter
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
            onDeleteFilter,
          }}
          activeFilters={{
            policy: selectedPolicies,
          }}
        />
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

export const SystemDetails = ({ inventoryId, hidePassed, ...props }) => {
  let { data, error, loading } = useQuery(QUERY, {
    variables: { systemId: inventoryId },
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

SystemDetails.propTypes = {
  inventoryId: propTypes.string,
  hidePassed: propTypes.bool,
};

const WrappedSystemDetails = ({
  customItnl,
  customRouter,
  intlProps,
  client,
  ...props
}) => {
  const IntlWrapper = customItnl ? IntlProvider : React.Fragment;
  const RouterWrapper = customRouter ? Router : React.Fragment;
  const store = init().getStore();

  return (
    <RouterWrapper>
      <IntlWrapper {...(customItnl && intlProps)}>
        <ApolloProvider client={client}>
          <Provider store={store}>
            <SystemDetails {...props} />
          </Provider>
        </ApolloProvider>
      </IntlWrapper>
    </RouterWrapper>
  );
};

WrappedSystemDetails.propTypes = {
  customItnl: propTypes.bool,
  intlProps: propTypes.any,
  customRouter: propTypes.bool,
  client: propTypes.object,
};

WrappedSystemDetails.defaultProps = {
  client: new ApolloClient({
    link: new HttpLink({
      uri: COMPLIANCE_API_ROOT + '/graphql',
      credentials: 'include',
    }),
    cache: new InMemoryCache(),
  }),
};

export default WrappedSystemDetails;
