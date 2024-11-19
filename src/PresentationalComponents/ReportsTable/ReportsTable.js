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

const ReportsTable = ({
  reports,
  operatingSystems,
  policyTypes,
  options,
  total,
  loading,
}) => (
  <TableToolsTable
    aria-label="Reports"
    ouiaId="ReportsTable"
    columns={[...columns, PDFExportDownload]}
    items={reports}
    total={total}
    loading={loading}
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
      pagination: true,
      emptyRows: emptyRows('reports', columns.length),
      ...options,
    }}
    className={'reports-table'}
  />
);

ReportsTable.propTypes = {
  reports: propTypes.array.isRequired,
  total: propTypes.number,
  loading: propTypes.bool,
  operatingSystems: propTypes.array.isRequired,
  policyTypes: propTypes.array.isRequired,
  options: propTypes.object,
};

export default ReportsTable;
