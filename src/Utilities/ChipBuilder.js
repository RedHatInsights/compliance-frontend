import { conditionalFilterType } from '@redhat-cloud-services/frontend-components';

export class ChipBuilder {
    constructor(filterConfig) {
        this.filterConfig = filterConfig;
        this.config = this.filterConfig.config;
    }

    textFilterChip = (category, currentValue) => (currentValue !== '' ? {
        category,
        chips: [{ name: currentValue }]
    } : null)

    checkboxFilterChip = (category, currentValue) => (currentValue.length > 0 ? {
        category,
        chips: currentValue.map((value) => (
            { name: this.filterConfig.labelForValue(value, category) }
        ))
    } : null)

    updatedChips = (filter, currentValue) => {
        const categoryConfig = this.filterConfig.getCategoryForLabel(filter);
        const { label, type } = categoryConfig ? categoryConfig : { label: filter, type: null };

        if (type === conditionalFilterType.text) {
            return this.textFilterChip(label, currentValue);
        } else if (type === conditionalFilterType.checkbox) {
            return this.checkboxFilterChip(label, currentValue);
        } else {
            return null;
        }
    }

    chipsFor = (filters) => {
        let chips = Object.keys(filters).map((filter) => {
            return this.updatedChips(filter, filters[filter]);
        }).filter((f) => (!!f));

        return Promise.resolve(chips);
    }
}
