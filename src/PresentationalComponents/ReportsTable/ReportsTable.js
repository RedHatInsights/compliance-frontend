import React from 'react';
import propTypes from 'prop-types';
import useComplianceTableDefaults from 'Utilities/hooks/useComplianceTableDefaults';
import { emptyRows } from 'PresentationalComponents/NoResultsTable/NoResultsTable';
import { ComplianceTable as TableToolsTable } from 'PresentationalComponents';
import columns, { exportableColumns, PDFExportDownload } from './Columns';
import {
  policyNameFilter,
  operatingSystemFilter,
  policyComplianceFilter,
} from './Filters';
import { getAppConfig } from '@/config/appConfig';
import '../../App.scss';

const ReportsTable = ({
  reports,
  operatingSystems,
  options,
  total,
  loading,
}) => {
  const complianceTableDefaults = useComplianceTableDefaults();
  const tableColumns = [
    ...columns,
    ...(getAppConfig().features.pdf ? [PDFExportDownload] : []),
  ];

  return (
    <TableToolsTable
      aria-label="Reports"
      ouiaId="ReportsTable"
      columns={tableColumns}
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
        emptyRows: emptyRows('reports', tableColumns.length),
        ...options,
      }}
      className={'reports-table'}
    />
  );
};

ReportsTable.propTypes = {
  reports: propTypes.array,
  total: propTypes.number,
  loading: propTypes.bool,
  operatingSystems: propTypes.array,
  options: propTypes.object,
};

export default ReportsTable;
