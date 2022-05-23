import React from 'react';
import propTypes from 'prop-types';
import { COMPLIANCE_TABLE_DEFAULTS } from '@/constants';
import { emptyRows } from '../../Utilities/hooks/useTableTools/Components/NoResultsTable';
import { TableToolsTable } from 'Utilities/hooks/useTableTools';
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
        ],
      }}
      options={{
        ...COMPLIANCE_TABLE_DEFAULTS,
        exportable: {
          ...COMPLIANCE_TABLE_DEFAULTS.exportable,
          columns: exportableColumns,
        },
        manageColumns: manageColumnsEnabled,
        emptyRows: emptyRows('reports', columns.length),
      }}
    />
  );
};

ReportsTable.propTypes = {
  profiles: propTypes.array,
};

export default ReportsTable;
