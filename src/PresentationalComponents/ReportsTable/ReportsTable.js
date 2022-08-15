import React from 'react';
import propTypes from 'prop-types';
import TableToolsTable from '@redhat-cloud-services/frontend-components/TableToolsTable';
import { COMPLIANCE_TABLE_DEFAULTS } from '@/constants';
import { uniq } from 'Utilities/helpers';
import useFeature from 'Utilities/hooks/useFeature';
import columns, { exportableColumns, PDFExportDownload } from './Columns';
import {
  policyNameFilter,
  policyTypeFilter,
  operatingSystemFilter,
  policyComplianceFilter,
} from './Filters';

const ReportsTable = ({ profiles }) => {
  const manageColumnsEnabled = useFeature('manageColumns');
  const pdfReportEnabled = useFeature('pdfReport');
  const policyTypes = uniq(
    profiles.map(({ policyType }) => policyType).filter((i) => !!i)
  );
  const operatingSystems = uniq(
    profiles.map(({ osMajorVersion }) => osMajorVersion).filter((i) => !!i)
  );

  return (
    <TableToolsTable
      aria-label="Reports"
      ouiaId="ReportsTable"
      columns={[
        ...columns,
        ...((pdfReportEnabled && [PDFExportDownload]) || []),
      ]}
      items={profiles}
      isStickyHeader
      filters={{
        filterConfig: [
          ...policyNameFilter,
          ...((policyTypes.length > 0 && policyTypeFilter(policyTypes)) || []),
          ...((operatingSystems.length > 0 &&
            operatingSystemFilter(operatingSystems)) ||
            []),
          ...policyComplianceFilter,
          {
            type: 'radio',
            label: 'Radio Filter',
            items: ['OPTION 1', 'OPTION 2', 'OPTION 3'].map((option) => ({
              label: option,
              value: option,
            })),
            filter: (items) => items,
          },
          {
            type: 'UNKNOWNTYPE',
            label: 'Invalid Filter',
            items: ['OPTION 1', 'OPTION 2', 'OPTION 3'].map((option) => ({
              label: option,
              value: option,
            })),
            filter: (items) => items,
          },
          {
            type: 'group',
            label: 'Filter group',
            items: [
              {
                label: 'Parent 1',
                value: 1,
                groupSelectable: true,
                items: [
                  { label: 'Child 1.1', value: 1.1 },
                  { label: 'Child 2.2', value: 1.2 },
                ],
              },
              {
                label: 'Parent 2',
                value: 2,
                items: [
                  { label: 'Child 2.1', value: 2.1 },
                  { label: 'Child 2.2', value: 2.2 },
                ],
              },
            ],
            filter: () => [],
          },
        ],
      }}
      options={{
        ...COMPLIANCE_TABLE_DEFAULTS,
        exportable: {
          ...COMPLIANCE_TABLE_DEFAULTS.exportable,
          columns: exportableColumns,
        },
        manageColumns: manageColumnsEnabled,
      }}
    />
  );
};

ReportsTable.propTypes = {
  profiles: propTypes.array,
};

export default ReportsTable;
