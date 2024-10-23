import React from 'react';
import propTypes from 'prop-types';
import { COMPLIANCE_TABLE_DEFAULTS } from '@/constants';
import { emptyRows } from '../../Utilities/hooks/useTableTools/Components/NoResultsTable';
import { ComplianceTable as TableToolsTable } from 'PresentationalComponents';
import columns, { exportableColumns, PDFExportDownload } from './Columns';
import {
  policyNameFilter,
  policyTypeFilter,
  operatingSystemFilter,
  policyComplianceFilter,
} from './Filters';
import '../../App.scss';

const ReportsTable = ({ reports, operatingSystems, policyTypes }) => (
  <TableToolsTable
    aria-label="Reports"
    ouiaId="ReportsTable"
    columns={[...columns, PDFExportDownload]}
    items={reports}
    isStickyHeader
    filters={{
      filterConfig: [
        ...policyNameFilter,
        ...(policyTypes?.length > 0 ? policyTypeFilter(policyTypes) : []),
        ...(operatingSystems?.length > 0
          ? operatingSystemFilter(operatingSystems)
          : []),
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

ReportsTable.propTypes = {
  reports: propTypes.array.isRequired,
  operatingSystems: propTypes.array.isRequired,
  policyTypes: propTypes.array.isRequired,
};

export default ReportsTable;
