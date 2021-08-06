import React from 'react';
import SelectedFilterSwitch from './Components/SelectedFilterSwitch';

const useSelectedFilter = ({
  setActiveFilter,
  activeFilters,
  selectedFilter,
}) => {
  const enableSelectedFilter = !!selectedFilter;
  const filterKey = 'selected';
  const filterItem = {
    type: 'hidden',
    label: 'selectFilter',
    key: filterKey,
    default: true,
    filter: (items, value) => {
      return items.filter((item) => item?.rowProps?.selected === value);
    },
  };
  const isChecked = activeFilters[filterKey] === true;
  const selectedToggle = (
    <SelectedFilterSwitch
      {...{
        setActiveFilter,
        isChecked,
      }}
    />
  );

  return enableSelectedFilter
    ? {
        filterItem,
        toolbarProps: {
          dedicatedAction: selectedToggle,
        },
      }
    : {};
};

export default useSelectedFilter;
