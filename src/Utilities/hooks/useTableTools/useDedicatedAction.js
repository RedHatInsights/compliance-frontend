import React from 'react';

const useDedicatedAction = (options) => {
    const {
        dedicatedAction: dedicatedActionOption, additionalDedicatedActions, selected
    } = options;

    return {
        toolbarProps: {
            dedicatedAction: [
                dedicatedActionOption,
                ...additionalDedicatedActions
            ].filter((v) => (!!v)).map((DedicatedAction, idx) => (
                <DedicatedAction key={ `dedicated-table-action-${ idx }`} { ...{ selected } } />
            ))
        }
    };
};

export default useDedicatedAction;
