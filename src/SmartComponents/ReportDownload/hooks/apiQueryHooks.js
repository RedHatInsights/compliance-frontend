import { useCallback } from 'react';
import { useApolloClient } from '@apollo/client';
import { GET_SYSTEMS, GET_RULES } from '../constants';
import usePromiseQueue from 'Utilities/hooks/usePromiseQueue';
import { apiInstance } from '../../../Utilities/hooks/useQuery';
import dataSerialiser from '../../../Utilities/dataSerialiser';
import concat from 'lodash/concat';
import { calculateOffset } from '@/Utilities/helpers';

const COMPLIANT_SYSTEMS_FILTER = 'compliant = true and supported = true';
const NON_COMPLIANT_SYSTEMS_FILTER = 'compliant = false and supported = true';
const UNSUPPORTED_SYSTEMS_FILTER = 'supported = false';
const NOT_REPORTING_SYSTEMS_FILTER = 'never_reported = true';

const testResultDataMapper = {
  display_name: 'name',
  end_time: 'testResultProfiles[0].lastScanned',
  failed_rule_count: 'testResultProfiles[0].rulesFailed',
  supported: 'testResultProfiles[0].supported',
  os_major_version: 'osMajorVersion',
  os_minor_version: 'osMinorVersion',
  compliant: 'testResultProfiles[0].compliant',
  score: 'testResultProfiles[0].score',
  security_guide_version: 'testResultProfiles[0].benchmark.version',
};

const reportSystemsDataMapper = {
  display_name: 'name',
  os_major_version: 'osMajorVersion',
  os_minor_version: 'osMinorVersion',
  'policies[0].title': 'policies[0].name',
  culled_timestamp: 'culledTimestamp',
  stale_timestamp: 'staleTimestamp',
  stale_warning_timestamp: 'staleWarningTimestamp',
};

const failedRulesDataMapper = {
  count: 'failedCount',
  ref_id: 'refId',
  id: 'id',
  title: 'title',
  'identifier.label': 'identifier.label',
  'identifier.system': 'identifier.system',
  severity: 'severity',
};

const useFetchBatched = () => {
  const { isResolving: isLoading, resolve } = usePromiseQueue();

  return {
    isLoading,
    fetchBatched: useCallback(
      (fetchFunction, total, filter, batchSize = 50) => {
        const pages = Math.ceil(total / batchSize) || 1;

        const results = resolve(
          [...new Array(pages)].map(
            (_, pageIdx) => () => fetchFunction(batchSize, pageIdx + 1, filter)
          )
        );

        return results;
      },
      [resolve]
    ),
  };
};

export const useSystemsFetch = ({ id: policyId, totalHostCount } = {}) => {
  const client = useApolloClient();
  const { fetchBatched } = useFetchBatched();

  const fetchFunction = useCallback(
    (perPage, page) =>
      client.query({
        query: GET_SYSTEMS,
        fetchResults: true,
        fetchPolicy: 'no-cache',
        variables: {
          perPage,
          page,
          filter: `policy_id = ${policyId}`,
          policyId,
        },
      }),
    [client, GET_SYSTEMS, policyId]
  );

  return async () =>
    (await fetchBatched(fetchFunction, totalHostCount)).flatMap(
      ({
        data: {
          systems: { edges },
        },
      }) => edges.map(({ node }) => node)
    );
};

export const useFetchRules = ({ id: policyId } = {}) => {
  const client = useApolloClient();

  const fetchFunction = useCallback(
    (perPage = 10, page = 1) =>
      client.query({
        query: GET_RULES,
        fetchResults: true,
        fetchPolicy: 'no-cache',
        variables: {
          perPage,
          page,
          filter: `policy_id = ${policyId}`,
          policyId,
        },
      }),
    [client, GET_RULES, policyId]
  );

  return async () =>
    (await fetchFunction()).data.profiles?.edges.flatMap(
      (edge) => edge.node.topFailedRules
    );
};

export const useFetchFailedRulesRest = ({ id: reportId } = {}) => {
  return useCallback(
    () =>
      apiInstance
        .reportStats(reportId)
        .then(({ data: { top_failed_rules } = {} }) =>
          dataSerialiser(top_failed_rules, failedRulesDataMapper)
        ),
    [reportId]
  );
};

const useFetchReportTestResults = (reportId, filter) =>
  useCallback(
    (perPage, page) =>
      apiInstance
        .reportTestResults(
          reportId,
          undefined,
          undefined,
          perPage,
          calculateOffset(page, perPage),
          undefined,
          undefined,
          filter
        )
        .then(({ data: { data } = {} }) =>
          dataSerialiser(data || [], testResultDataMapper)
        ),
    [reportId, filter]
  );

const useFetchReportSystems = (reportId, filter) =>
  useCallback(
    (perPage, page) =>
      apiInstance
        .reportSystems(
          reportId,
          undefined,
          undefined,
          perPage,
          calculateOffset(page, perPage),
          undefined,
          undefined,
          filter
        )
        .then(({ data: { data } = {} }) =>
          dataSerialiser(data || [], reportSystemsDataMapper)
        ),
    [reportId, filter]
  );

export const useSystemsFetchRest = ({
  id: reportId,
  compliantHostCount,
  unsupportedHostCount,
  totalHostCount,
  testResultHostCount,
} = {}) => {
  const { fetchBatched } = useFetchBatched();
  const fetchCompliant = useFetchReportTestResults(
    reportId,
    COMPLIANT_SYSTEMS_FILTER
  );
  const fetchNonCompliante = useFetchReportTestResults(
    reportId,
    NON_COMPLIANT_SYSTEMS_FILTER
  );
  const fetchUnsupported = useFetchReportTestResults(
    reportId,
    UNSUPPORTED_SYSTEMS_FILTER
  );
  const fetchNeverReported = useFetchReportSystems(
    reportId,
    NOT_REPORTING_SYSTEMS_FILTER
  );

  const fetchAndConcat = (fetchFunction, count) => {
    return fetchBatched(fetchFunction, count).then((result) =>
      concat(...result)
    );
  };

  return async () =>
    Promise.all([
      fetchAndConcat(fetchCompliant, compliantHostCount),
      fetchAndConcat(fetchNonCompliante, totalHostCount - compliantHostCount),
      fetchAndConcat(fetchUnsupported, unsupportedHostCount),
      fetchAndConcat(fetchNeverReported, totalHostCount - testResultHostCount),
    ]);
};
