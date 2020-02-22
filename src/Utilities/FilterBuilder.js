import { stringToId } from 'Utilities/TextHelper';
import { conditionalFilterType } from '@redhat-cloud-services/frontend-components';

export class FilterBuilder {
    constructor(filterConfig) {
        this.filterConfig = filterConfig;
        this.config = this.filterConfig.config;
    }

    buildFilterFilterString = (configItem, value) => {
        if (!value) { return []; }

        const { type, filterString } = configItem;

        if (type === conditionalFilterType.text) {
            return [filterString(value)];
        } else if (type === conditionalFilterType.checkbox) {
            return value.map((filter) => (
                filterString(filter)
            ));
        } else {
            return [];
        }
    }

    combineFilterStrings = (filterStringArray) => {
        const moreThanTwo = filterStringArray.map((f) => (f.length)).filter((fl) => (fl > 0)).length >= 2;
        return filterStringArray.map((fs) => (fs.join(' or '))).join(moreThanTwo ? ' and ' : '');
    }

    buildFilterString = (filters) => {
        const filterStringArray = this.config.map((configItem) => (
            this.buildFilterFilterString(configItem, filters[stringToId(configItem.label)])
        )).filter((f) => (f.length > 0));
        return this.combineFilterStrings(filterStringArray);
    }
}
