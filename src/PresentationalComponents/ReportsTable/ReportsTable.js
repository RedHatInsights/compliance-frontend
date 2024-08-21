import React from 'react';
import propTypes from 'prop-types';
import { COMPLIANCE_TABLE_DEFAULTS } from '@/constants';
import { emptyRows } from '../../Utilities/hooks/useTableTools/Components/NoResultsTable';
import { ComplianceTable as TableToolsTable } from 'PresentationalComponents';
import { uniq } from 'Utilities/helpers';
import columns, { exportableColumns, PDFExportDownload } from './Columns';
import {
  policyNameFilter,
  policyTypeFilter,
  operatingSystemFilter,
  policyComplianceFilter,
} from './Filters';
import '../../App.scss';

const ReportsTable = ({ reports }) => {
  const policyTypes = uniq(
    reports.map(({ policyType }) => policyType).filter((i) => !!i)
  );
  const operatingSystems = uniq(
    reports.map(({ osMajorVersion }) => osMajorVersion).filter((i) => !!i)
  );

  return (
    <TableToolsTable
      aria-label="Reports"
      ouiaId="ReportsTable"
      columns={[...columns, PDFExportDownload]}
      items={reports}
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
        emptyRows: emptyRows('reports', columns.length),
      }}
      className={'reports-table'}
    />
  );
};

ReportsTable.propTypes = {
  reports: propTypes.array.isRequired,
};

export default ReportsTable;
