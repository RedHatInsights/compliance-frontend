import React from 'react';
import propTypes from 'prop-types';
import useComplianceTableDefaults from 'Utilities/hooks/useComplianceTableDefaults';
import { emptyRows } from '@/Frameworks/AsyncTableTools/components/NoResultsTable';
import { ComplianceTable as TableToolsTable } from 'PresentationalComponents';
import columns, { exportableColumns, PDFExportDownload } from './Columns';
import {
  policyNameFilter,
  operatingSystemFilter,
  policyComplianceFilter,
} from './Filters';
import '../../App.scss';

const ReportsTable = ({
  reports,
  operatingSystems,
  options,
  total,
  loading,
}) => {
  const complianceTableDefaults = useComplianceTableDefaults();

  return (
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
          ...(operatingSystems?.length > 0
            ? operatingSystemFilter(operatingSystems)
            : []),
          ...policyComplianceFilter,
        ],
      }}
      options={{
        ...complianceTableDefaults,
        exportable: {
          ...complianceTableDefaults.exportable,
          columns: exportableColumns,
        },
        pagination: true,
        emptyRows: emptyRows('reports', columns.length),
        ...options,
      }}
      className={'reports-table'}
    />
  );
};

ReportsTable.propTypes = {
  reports: propTypes.array.isRequired,
  total: propTypes.number,
  loading: propTypes.bool,
  operatingSystems: propTypes.array.isRequired,
  options: propTypes.object,
};

export default ReportsTable;
