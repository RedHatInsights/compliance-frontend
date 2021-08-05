import React from 'react';

const useDedicatedAction = ({ dedicatedAction, selectedItems, additionalDedicatedActions = []}) => {
    const actions = [dedicatedAction, ...additionalDedicatedActions].filter((a) => !!a);

    return actions.length > 0 ? (
        <div>
            { actions.map((Action) => (
                React.isValidElement(Action) ? Action : <Action { ...{ selectedItems } } />
            )) }
        </div>
    ) : undefined;
};

export default useDedicatedAction;
