import * as Columns from '../SystemsTable/Columns';

export const reportedSystemTableColumns = [
  Columns.customDisplay({
    showLink: true,
    showOsInfo: true,
    idProperty: 'system_id',
  }),
  Columns.Workspaces,
  Columns.Tags,
  Columns.SsgVersion,
  Columns.FailedRules,
  Columns.ComplianceScore,
  Columns.LastScanned,
];

export const neverReportedSystemsTableColumns = [
  Columns.customName({
    showLink: true,
    showOsInfo: true,
  }),
  Columns.Workspaces,
  Columns.Tags,
  Columns.LastScanned,
];
