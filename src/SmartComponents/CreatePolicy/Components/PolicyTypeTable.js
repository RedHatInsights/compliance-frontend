import React from 'react';
import propTypes from 'prop-types';
import { fitContent } from '@patternfly/react-table';
import { InUseProfileLabel } from 'PresentationalComponents';
import { TableToolsTable } from 'Utilities/hooks/useTableTools';
import { renderComponent } from 'Utilities/helpers';
import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import PolicyTypeDetailsRow from './PolicyTypeDetailsRow';

const NameCell = ({ name, disabled }) => {
  return (
    <>
      {name} {disabled && <InUseProfileLabel compact />}
    </>
  );
};

NameCell.propTypes = {
  name: propTypes.string,
  disabled: propTypes.boolean,
};

const PolicyTypeTable = ({ profiles, onChange, selectedProfile }) => (
  <TableToolsTable
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
    columns={[
      {
        title: 'Policy name',
        key: 'name',
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
    ]}
    options={{
      detailsComponent: PolicyTypeDetailsRow,
      hasRadioSelect: true,
      sortBy: {
        index: 2,
        direction: 'asc',
        property: 'name',
      },
    }}
    onSelect={(_event, _value, _rowIdx, { itemId }) =>
      onChange && onChange(profiles.find(({ id }) => id === itemId))
    }
    selectVariant="radio"
    variant="compact"
  />
);

PolicyTypeTable.propTypes = {
  profiles: propTypes.array,
  onChange: propTypes.func,
  selectedProfile: propTypes.string,
};

export default PolicyTypeTable;
