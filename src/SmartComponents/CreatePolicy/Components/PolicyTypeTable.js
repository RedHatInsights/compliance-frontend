import React from 'react';
import propTypes from 'prop-types';
import { fitContent } from '@patternfly/react-table';
import { ComplianceTable as TableToolsTable } from 'PresentationalComponents';
import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import PolicyTypeDetailsRow from './PolicyTypeDetailsRow';
import { emptyRows } from 'Utilities/hooks/useTableTools/Components/NoResultsTable';

const PolicyTypeTable = ({
  profiles,
  onChange,
  selectedProfile,
  loading,
  total,
}) => {
  const columns = [
    {
      title: 'Policy name',
      key: 'title',
      sortable: 'title',
    },
    {
      title: 'Supported OS versions',
      transforms: [fitContent],
      sortable: 'os_minor_versions',
      renderFunc: (_data, _id, profile) =>
        profile.supportedOsVersions.join(', '),
    },
  ];

  return (
    <TableToolsTable
      aria-label="PolicyTypeTable"
      ouiaId="PolicyTypeTable"
      items={profiles?.map((profile) => ({
        ...profile,
        rowProps: {
          selected: profile.id === selectedProfile?.id,
        },
      }))}
      loading={loading}
      total={total}
      filters={{
        filterConfig: [
          {
            type: conditionalFilterType.text,
            label: 'Policy name',
            filterAttribute: 'title',
          },
        ],
      }}
      columns={columns}
      options={{
        detailsComponent: PolicyTypeDetailsRow,
        onRadioSelect: (_event, _value, _rowIdx, { itemId }) =>
          onChange && onChange(profiles.find(({ id }) => id === itemId)),
        emptyRows: emptyRows('policy types', columns.length),
      }}
      variant="compact"
    />
  );
};

PolicyTypeTable.propTypes = {
  profiles: propTypes.array,
  onChange: propTypes.func,
  selectedProfile: propTypes.shape({
    id: propTypes.string,
  }),
  loading: propTypes.bool,
  total: propTypes.number,
};

export default PolicyTypeTable;
