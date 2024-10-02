import React from 'react';
import propTypes from 'prop-types';
import { fitContent, info } from '@patternfly/react-table';
import { InUseProfileLabel } from 'PresentationalComponents';
import { TableToolsTable } from 'Utilities/hooks/useTableTools';
import { renderComponent } from 'Utilities/helpers';
import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import PolicyTypeDetailsRow from './PolicyTypeDetailsRow';
import { emptyRows } from 'Utilities/hooks/useTableTools/Components/NoResultsTable';

const NameCell = ({ name, disabled }) => {
  return (
    <>
      {disabled && <InUseProfileLabel compact />}
      {name}
    </>
  );
};

NameCell.propTypes = {
  name: propTypes.string,
  disabled: propTypes.bool,
};

const PolicyTypeTable = ({ profiles, onChange, selectedProfile }) => {
  const columns = [
    {
      title: 'Policy name',
      key: 'name',
      transforms: [
        info({
          tooltip:
            'In use policies have already been used and therefore can not be applied to another SCAP Policy under the selected OS.',
        }),
      ],
      sortByProp: 'name',
      renderFunc: renderComponent(NameCell),
    },
    {
      title: 'Supported OS versions',
      transforms: [fitContent],
      sortByProp: 'supportedOsVersions',
      renderFunc: (_data, _id, profile) =>
        profile.supportedOsVersions.join(', '),
    },
  ];

  return (
    <TableToolsTable
      aria-label="PolicyTypeTable"
      items={profiles.map((profile) => ({
        ...profile,
        rowProps: {
          selected: profile.id === selectedProfile?.id,
          disableSelection: profile.disabled,
        },
      }))}
      filters={{
        filterConfig: [
          {
            type: conditionalFilterType.text,
            label: 'Policy Name',
            filter: (policyTypes, value) =>
              policyTypes.filter((policyType) =>
                policyType?.name.toLowerCase().includes(value.toLowerCase())
              ),
          },
        ],
      }}
      columns={columns}
      options={{
        detailsComponent: PolicyTypeDetailsRow,
        onRadioSelect: (_event, _value, _rowIdx, { itemId }) =>
          onChange && onChange(profiles.find(({ id }) => id === itemId)),
        sortBy: {
          index: 2,
          direction: 'asc',
          property: 'name',
        },
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
};

export default PolicyTypeTable;
