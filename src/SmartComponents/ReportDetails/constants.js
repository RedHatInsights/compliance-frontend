import * as Columns from '../SystemsTable/Columns';

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
