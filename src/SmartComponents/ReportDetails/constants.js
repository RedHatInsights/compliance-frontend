import { systemsDataMapper, testResultsDataMapper } from '@/constants';
import dataSerialiser from 'Utilities/dataSerialiser';
import { buildOSObject } from 'Utilities/helpers';
import { apiInstance } from 'Utilities/hooks/useQuery';

export const processTestResultsData = (data) =>
  dataSerialiser(
    data.map((entry) => ({
      ...entry,
    })),
    testResultsDataMapper
  );

export const processSystemsData = (data) =>
  dataSerialiser(data, systemsDataMapper);

export const fetchReportingCustomOSes = ({ filters, reportId }) =>
  apiInstance.reportTestResultsOS(reportId, null, filters).then(({ data }) => {
    return {
      results: buildOSObject(data),
      total: data?.length || 0,
    };
  });

export const fetchNeverReportedCustomOSes = ({ filters, reportId }) =>
  apiInstance.reportSystemsOS(reportId, null, filters).then(({ data }) => {
    return {
      results: buildOSObject(data),
      total: data?.length || 0,
    };
  });
