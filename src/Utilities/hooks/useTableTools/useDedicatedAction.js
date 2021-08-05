import React from 'react';

const useDedicatedAction = (options) => {
    const enableDedicatedAction = !!options.dedicatedAction;
    const {
        dedicatedAction: dedicatedActionOption, additionalDedicatedActions
    } = options;

    return enableDedicatedAction ? {
        toolbarProps: {
            dedicatedAction: <div> { dedicatedActionOption } { additionalDedicatedActions } </div>
        } } : {};
};

export default useDedicatedAction;
