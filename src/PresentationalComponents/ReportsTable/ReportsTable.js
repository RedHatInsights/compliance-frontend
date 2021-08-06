import React from 'react';
import propTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableHeader,
  sortable,
  fitContent,
} from '@patternfly/react-table';
import PrimaryToolbar from '@redhat-cloud-services/frontend-components/PrimaryToolbar';
import { emptyRows } from 'PresentationalComponents';
import useFilterConfig from 'Utilities/hooks/useTableTools/useFilterConfig';
import useTableSort from 'Utilities/hooks/useTableSort';
import { Name, OperatingSystem, CompliantSystems } from './Cells';
import { uniq } from 'Utilities/helpers';
import {
  policyNameFilter,
  policyTypeFilter,
  operatingSystemFilter,
  policyComplianceFilter,
} from './Filters';

const ReportsTable = ({ profiles }) => {
  const columns = [
    {
      title: 'Policy',
      transforms: [sortable],
      sortByProperty: 'name',
      props: {
        width: 55,
      },
    },
    {
      title: 'Operating system',
      transforms: [sortable, fitContent],
      sortByProperty: 'majorOsVersion',
      props: {
        width: 20,
      },
    },
    {
      title: 'Systems meeting compliance',
      transforms: [sortable, fitContent],
      sortByFunction: ({ testResultHostCount, compliantHostCount }) =>
        (100 / testResultHostCount) * compliantHostCount,
      props: {
        width: 25,
      },
    },
  ];
  const policyTypes = uniq(
    profiles.map(({ policyType }) => policyType).filter((i) => !!i)
  );
  const operatingSystems = uniq(
    profiles.map(({ majorOsVersion }) => majorOsVersion).filter((i) => !!i)
  );
  const { toolbarProps: conditionalFilter, filter } = useFilterConfig({
    filters: {
      filterConfig: [
        ...policyNameFilter,
        ...((policyTypes.length > 0 && policyTypeFilter(policyTypes)) || []),
        ...((operatingSystems.length > 0 &&
          operatingSystemFilter(operatingSystems)) ||
          []),
        ...policyComplianceFilter,
      ],
    },
  });
  const filteredProfiles = filter(profiles);

  const { tableSort, sorted: sortedProfiles } = useTableSort(
    filteredProfiles,
    columns
  );
  const rows =
    sortedProfiles.length > 0
      ? sortedProfiles.map((profile) => ({
          cells: [
            { title: <Name {...profile} /> },
            { title: <OperatingSystem {...profile} /> },
            { title: <CompliantSystems {...profile} /> },
          ],
        }))
      : emptyRows;

  return (
    <React.Fragment>
      <PrimaryToolbar {...conditionalFilter} />
      <Table
        aria-label="Reports"
        ouiaId="ReportsTable"
        cells={columns}
        rows={rows}
        {...tableSort}
      >
        <TableHeader />
        <TableBody />
      </Table>
    </React.Fragment>
  );
};

ReportsTable.propTypes = {
  profiles: propTypes.array,
};

export default ReportsTable;
