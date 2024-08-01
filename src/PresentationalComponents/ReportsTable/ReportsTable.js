import React, { useEffect } from 'react';
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

const ReportsTable = ({ profiles }) => {
  const policyTypes = uniq(
    profiles.map(({ policyType }) => policyType).filter((i) => !!i)
  );
  const operatingSystems = uniq(
    profiles.map(({ osMajorVersion }) => osMajorVersion).filter((i) => !!i)
  );

  useEffect(() => {
    localStorage.setItem('insights:compliance:asynctables', 'true');
  }, []);

  const selectionTransformer = (row, selectedIds) => ({
    ...row,
    selected: selectedIds.includes(row.itemId),
  });

  return (
    <TableToolsTable
      aria-label="Reports"
      ouiaId="ReportsTable"
      columns={[...columns, PDFExportDownload]}
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
        emptyRows: emptyRows('reports', columns.length),
        onSelect: (...args) => {
          console.log(args, 'bulk select)');
        },
        total: profiles.length,
        itemIdsInTable: () =>
          Promise.resolve([
            '2417de92-770f-471d-8cf8-9c35e8b68424',
            '51b20ac0-c6c1-4d5a-b4fe-42eaf1fbce0e',
          ]),
        rowTransformers: [selectionTransformer],
      }}
      className={'reports-table'}
    />
  );
};

ReportsTable.propTypes = {
  profiles: propTypes.array,
};

export default ReportsTable;
