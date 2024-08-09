import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { Grid } from '@patternfly/react-core';
import PageHeader, {
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import ComplianceEmptyState from 'PresentationalComponents/ComplianceEmptyState';
import {
  LinkWithPermission as Link,
  ErrorPage,
  LoadingPoliciesTable,
  PoliciesTable,
  StateView,
  StateViewPart,
  LinkButton,
} from 'PresentationalComponents';
import { usePoliciesQuery } from '../../Utilities/hooks/usePoliciesQuery/usePoliciesQuery';
import useAPIV2FeatureFlag from '../../Utilities/hooks/useAPIV2FeatureFlag';
import PropTypes from 'prop-types';

const QUERY = gql`
  {
    profiles(search: "external = false and canonical = false") {
      edges {
        node {
          id
          name
          description
          refId
          complianceThreshold
          totalHostCount
          osMajorVersion
          policyType
          policy {
            id
            name
          }
          businessObjective {
            id
            title
          }
        }
      }
    }
  }
`;

export const CompliancePoliciesBase = ({ query }) => {
  const location = useLocation();
  const CreateLink = () => (
    <Link
      to="/scappolicies/new"
      Component={LinkButton}
      componentProps={{
        variant: 'primary',
        ouiaId: 'CreateNewPolicyButton',
      }}
    >
      Create new policy
    </Link>
  );

  let { data, error, loading, refetch } = query;
  useEffect(() => {
    refetch();
  }, [location, refetch]);
  let policies;

  if (data) {
    error = undefined;
    loading = undefined;
    policies = data.profiles.edges.map((profile) => profile.node);
  }

  return (
    <React.Fragment>
      <PageHeader className="page-header">
        <PageHeaderTitle title="SCAP policies" />
      </PageHeader>
      <section className="pf-v5-c-page__main-section">
        <StateView stateValues={{ error, data, loading }}>
          <StateViewPart stateKey="error">
            <ErrorPage error={error} />
          </StateViewPart>
          <StateViewPart stateKey="loading">
            <LoadingPoliciesTable />
          </StateViewPart>
          <StateViewPart stateKey="data">
            {policies && policies.length === 0 ? (
              <Grid hasGutter>
                <ComplianceEmptyState
                  title="No policies"
                  mainButton={<CreateLink />}
                />
              </Grid>
            ) : (
              <PoliciesTable policies={policies} DedicatedAction={CreateLink} />
            )}
          </StateViewPart>
        </StateView>
      </section>
    </React.Fragment>
  );
};

CompliancePoliciesBase.propTypes = {
  query: PropTypes.shape({
    data: PropTypes.object,
    error: PropTypes.string,
    loading: PropTypes.bool,
    refetch: PropTypes.func,
  }),
};

const CompliancePoliciesV2 = () => {
  const query = usePoliciesQuery();
  let policies = query.data?.data
    ? query.data.data.map((policy) => serialize(policy))
    : [];

  const transformedData = {
    profiles: {
      edges: policies.map((policy) => ({ node: policy })),
    },
  };

  return <CompliancePoliciesBase query={{ ...query, data: transformedData }} />;
};

const CompliancePoliciesGraphQL = () => {
  let query = useQuery(QUERY);
  return <CompliancePoliciesBase query={query} />;
};

const CompliancePoliciesWrapper = () => {
  const apiV2Enabled = useAPIV2FeatureFlag();

  return apiV2Enabled ? (
    <CompliancePoliciesV2 />
  ) : (
    <CompliancePoliciesGraphQL />
  );
};

const serialize = (input) => {
  const settings = {
    id: ['id', 'policy.id'],
    title: 'title',
    description: 'description',
    business_objective: 'businessObjective.title',
    compliance_threshold: 'complianceThreshold',
    total_system_count: 'totalHostCount',
    os_major_version: 'osMajorVersion',
    profile_title: ['policy.name', 'policyType'],
    ref_id: 'refId',
  };
  const getValue = (obj, key) => {
    let ref = obj;
    if (key.includes('.')) {
      key.split('.').forEach((element) => {
        ref = ref[element];
      });
    } else {
      ref = ref[key];
    }
    return ref;
  };

  let newObj = {};
  for (const [key, setting] of Object.entries(settings)) {
    const finalValue = getValue(input, key);
    let runs = setting;
    if (!Array.isArray(setting)) runs = [setting];

    runs.forEach((value) => {
      if (value.includes('.')) {
        const split = value.split('.');
        let ref = newObj;
        split.forEach((el, index) => {
          if (!Object.prototype.hasOwnProperty.call(ref, el)) {
            ref[el] = index + 1 !== split.length ? {} : finalValue;
          }
          ref = ref[el];
        });
      } else {
        if (key === 'os_major_version') {
          newObj[value] = input[key].toString();
        } else {
          newObj[value] = input[key];
        }
      }
    });
  }
  return newObj;
};

export default CompliancePoliciesWrapper;
