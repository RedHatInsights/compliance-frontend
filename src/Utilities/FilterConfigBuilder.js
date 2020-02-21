import {
    conditionalFilterType
} from '@redhat-cloud-services/frontend-components';
import { stringToId } from 'Utilities/TextHelper';

export class FilterConfigBuilder {
    constructor(config) {
        this.config = config;
    }

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

    labelForValue = (value, category) => {
        try {
            return this.config.filter((item) => (item.label === category))[0]
            .items.filter((item) => (item.value === value))[0].label;
        }
        catch (_) {
            // eslint-disable-next-line no-console
            console.info('No label found for ' + value + ' in ', category);
            return value;
        }
    };

    valueForLabel = (label, category) => {
        try {
            return this.config.filter((item) => (item.label === category))[0]
            .items.filter((item) => (item.label === label))[0].value;
        }
        catch (_) {
            // eslint-disable-next-line no-console
            console.info('No value found for ' + label + ' in ' + category);
            return label;
        }
    };
}
