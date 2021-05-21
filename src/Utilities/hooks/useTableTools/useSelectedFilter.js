import React from 'react';
import SelectedFilterSwitch from './Components/SelectedFilterSwitch';

const useSelectedFilter = ({
    setActiveFilter, activeFilters
}) => {
    const filterKey = 'selected';
    const filterItem = {
        type: 'hidden',
        label: 'selectFilter',
        key: filterKey,
        default: true,
        filter: (items, value) => {
            return items.filter((item) => (item?.rowProps?.selected === value));
        }
    };
    const isChecked = activeFilters[filterKey] === true;

    return {
        filterItem,
        toolbarProps: {
            dedicatedAction: () => ( // eslint-disable-line
                <SelectedFilterSwitch { ...{
                    setActiveFilter,
                    isChecked
                }  } />
            )
        }
    };
};

export default useSelectedFilter;
