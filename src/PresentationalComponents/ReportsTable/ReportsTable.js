import React from 'react';
import propTypes from 'prop-types';
import { emptyRows } from 'PresentationalComponents';
import { TableToolsTable } from 'Utilities/hooks/useTableTools';
import { uniq } from 'Utilities/helpers';
import useFeature from 'Utilities/hooks/useFeature';
import columns, { PDFExportDownload } from './Columns';
import {
  policyNameFilter,
  policyTypeFilter,
  operatingSystemFilter,
  policyComplianceFilter,
} from './Filters';

const ReportsTable = ({ profiles }) => {
  const pdfReportEnabled = useFeature('pdfReport');
  const policyTypes = uniq(
    profiles.map(({ policyType }) => policyType).filter((i) => !!i)
  );
  const operatingSystems = uniq(
    profiles.map(({ majorOsVersion }) => majorOsVersion).filter((i) => !!i)
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
      emptyRows={emptyRows}
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
    />
  );
};

ReportsTable.propTypes = {
  profiles: propTypes.array,
};

export default ReportsTable;
