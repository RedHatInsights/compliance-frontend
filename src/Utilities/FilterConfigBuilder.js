import {
    conditionalFilterType
} from '@redhat-cloud-services/frontend-components';
import { stringToId } from 'Utilities/TextHelper';
import { ChipBuilder } from './ChipBuilder';

export class FilterConfigBuilder {
    chipBuilder = null;

    constructor(config) {
        this.config = config;
    }

    getChipBuilder = (callback) => (
        this.chipBuilder = this.chipBuilder ? this.chipBuilder : new ChipBuilder(this, callback)
    )

    toTextFilterConfig = (item, handler, value) => ({
        type: conditionalFilterType.text,
        label: item.label,
        id: stringToId(item.label),
        filterValues: {
            value,
            onSubmit: (_event, selectedValues) => {
                handler(stringToId(item.label), selectedValues);
            }
        }
    });

    toCheckboxFilterConfig = (item, handler, value) => ({
        type: conditionalFilterType.checkbox,
        label: item.label,
        id: stringToId(item.label),
        filterValues: {
            value,
            items: item.items,
            onChange: (_event, selectedValues) => {
                handler(stringToId(item.label), selectedValues);
            }
        }
    });

    toFilterConfigItem = (item, handler, value) => {
        if (item.type === conditionalFilterType.text) {
            return this.toTextFilterConfig(item, handler, value);
        } else if (item.type === conditionalFilterType.checkbox) {
            return this.toCheckboxFilterConfig(item, handler, value);
        }
    };

    buildConfiguration = (handler, states, props = {}) => ({
        ...props,
        items: this.config.map((item) => (
            this.toFilterConfigItem(item, handler, states[stringToId(item.label)])
        ))
    });

    initialDefaultState = () => {
        let initState = {};
        this.config.forEach((filter) => {
            const filterStateName = filter.label.replace(' ', '').toLowerCase();
            if (filter.type ===  conditionalFilterType.checkbox) {
                initState[filterStateName] = [];
            } else if (filter.type === conditionalFilterType.text) {
                initState[filterStateName] = '';
            } else {
                return;
            }
        });
        return initState;
    };

    categoryLabelForValue = (value) => {
        const category = this.config.filter((category) => {
            return category.items ?
                category.items.map((item) => item.value).includes(value) : false;
        });

        return category ? category[0].label : value;
    };

    getCategoryForLabel = (query) => (
        this.config.filter((item) => (stringToId(item.label) === stringToId(query)))[0]
    )

    getItemByLabelOrValue = (query, category) => {
        const results = this.getCategoryForLabel(category).items.filter((item) => (
            item.value === query || item.label === query
        ));

        if (results.length === 1) {
            return results[0];
        } else if (results.length > 1) {
            // eslint-disable-next-line no-console
            console.info(`Multiple items found for ${query} in ${category}! Returning first one.`);
            return results[0];
        } else {
            // eslint-disable-next-line no-console
            console.info('No item found for ' + query + ' in ', category);
        }
    }

    labelForValue = (value, category) => {
        const item = this.getItemByLabelOrValue(value, category);
        return item ? item.label : value;
    };

    valueForLabel = (label, category) => {
        const item = this.getItemByLabelOrValue(label, category);
        return item ? item.value : label;
    };
}
