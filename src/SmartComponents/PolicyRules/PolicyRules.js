import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useParams, useLocation } from 'react-router-dom';
import gql from 'graphql-tag';
import propTypes from 'prop-types';
import RulesTable from '../../PresentationalComponents/RulesTable/RulesTable';
import * as Columns from '@/PresentationalComponents/RulesTable/Columns';

const PROFILES_QUERY = gql`
  query Profiles($filter: String!) {
    profiles(search: $filter) {
      edges {
        node {
          id
          name
          refId
          osMinorVersion
          osMajorVersion
          benchmark {
            id
            latestSupportedOsMinorVersions
          }
          rules {
            id
            title
            severity
            rationale
            refId
            description
            remediationAvailable
            identifier
          }
        }
      }
    }
  }
`;

const PolicyRules = () => {
  const { policy_id: policyId } = useParams();
  const location = useLocation();
  const filter = `id = ${policyId}`;

  const { data, loading, error, refetch } = useQuery(PROFILES_QUERY, {
    variables: {
      filter: filter,
    },
    skip: skipProfilesQuery,
  });
  const skipProfilesQuery = filter.length === 0;

  useEffect(() => {
    refetch();
  }, [location, refetch]);

  console.log(data, 'here data');

  return (
    <React.Fragment>
      {data && (
        <RulesTable
          remediationsEnabled={false}
          columns={[Columns.Name, Columns.Severity, Columns.Remediation]}
          loading={loading}
          profileRules={[
            {
              profile: {
                refId: data.profiles.edges[0].node.refId,
                name: data.profiles.edges[0].node.name,
              },
              rules: data.profiles.edges[0].node.rules,
            },
          ]}
        />
      )}
    </React.Fragment>
  );
};

PolicyRules.propTypes = {
  loading: propTypes.bool,
  policy: propTypes.shape({
    name: propTypes.string,
    refId: propTypes.string,
    rules: propTypes.array,
    benchmark: propTypes.object,
  }),
};
export default PolicyRules;
