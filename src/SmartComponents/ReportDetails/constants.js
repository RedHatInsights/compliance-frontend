import { buildOSObject } from 'Utilities/helpers';
import { apiInstance } from 'Utilities/hooks/useQuery';
import * as Columns from '../SystemsTable/Columns';

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

export const reportedSystemTableColumns = [
  Columns.customDisplay({
    showLink: true,
    showOsInfo: true,
    idProperty: 'system_id',
    sortBy: ['display_name'],
  }),
  Columns.Workspaces,
  Columns.Tags,
  Columns.SsgVersion(true),
  Columns.FailedRules(true),
  Columns.ComplianceScore(true),
  Columns.LastScanned,
];

export const neverReportedSystemsTableColumns = [
  Columns.customName(
    {
      showLink: true,
      showOsInfo: true,
    },
    {
      sortBy: ['display_name'],
    },
  ),
  Columns.inventoryColumn('groups', {
    requiresDefault: true,
    sortBy: ['groups'],
  }),
  Columns.inventoryColumn('tags'),
  Columns.LastScanned,
];
