import { useApolloClient, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { useCallback } from 'react';
import usePromiseQueue from './usePromiseQueue';

const TOTAL_COUNT_QUERY = gql`
  query Profiles($filter: String!) {
    profiles(search: $filter) {
      totalCount
    }
  }
`;

const QUERY = gql`
  query Profiles($filter: String!, $perPage: Int, $page: Int) {
    profiles(search: $filter, limit: $perPage, offset: $page) {
      edges {
        node {
          id
          name
          refId
          description
          policyType
          totalHostCount
          testResultHostCount
          compliantHostCount
          unsupportedHostCount
          osMajorVersion
          complianceThreshold
          businessObjective {
            id
            title
          }
          policy {
            id
            name
          }
          benchmark {
            id
            version
          }
        }
      }
    }
  }
`;

const useReportsFetch = () => {
  const client = useApolloClient();

  let { data } = useQuery(TOTAL_COUNT_QUERY, {
    variables: {
      // filter: 'has_policy_test_results = true AND external = false',
      filter: '',
    },
  });

  console.log('data', data?.profiles?.totalCount);

  let totalCount = data?.profiles?.totalCount;

  const { isResolving, results, resolve } = usePromiseQueue();

  const fetchFunction = useCallback(async (perPage, page) => {
    return await client.query({
      query: QUERY,
      fetchResults: true,
      fetchPolicy: 'no-cache',
      variables: {
        perPage,
        page,
        filter: '',
        // filter: 'has_policy_test_results = true AND external = false',
      },
    });
  });

  const fetch = async (batchSize = 100) => {
    let pages = Math.ceil(9999 / batchSize) || 1;
    console.log('totalCount: ', totalCount);
    console.log('batchSize: ', batchSize);
    console.log('pages: ', pages);
    const results = await resolve(
      [...new Array(pages)].map(
        (_, pageIdx) => () => fetchFunction(batchSize, pageIdx + 1)
      )
    );
    // console.log('results', results);
    return results;
  };

  return {
    isLoading: isResolving,
    data: results,
    fetch,
  };
};

export default useReportsFetch;
