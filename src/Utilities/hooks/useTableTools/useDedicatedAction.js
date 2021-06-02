import React from 'react';

const useDedicatedAction = (options) => {
    const enableDedicatedAction = !!options.dedicatedAction;
    const {
        dedicatedAction: dedicatedActionOption, additionalDedicatedActions, selected
    } = options;

    return enableDedicatedAction ? {
        toolbarProps: {
            dedicatedAction: [
                dedicatedActionOption,
                ...additionalDedicatedActions
            ].filter((v) => (!!v)).map((DedicatedAction, idx) => (
                <DedicatedAction key={ `dedicated-table-action-${ idx }`} { ...{ selected } } />
            ))
        }
    } : {};
};

export default useDedicatedAction;
