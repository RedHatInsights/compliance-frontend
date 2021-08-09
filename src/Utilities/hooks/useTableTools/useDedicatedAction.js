import React from 'react';

const useDedicatedAction = (options) => {
  const enableDedicatedAction = !!options.dedicatedAction;
  const {
    dedicatedAction: DedicatedActionOption,
    AdditionalDedicatedActions,
    selected,
  } = options;

  return enableDedicatedAction
    ? {
        toolbarProps: {
          dedicatedAction: (
            <div>
              {DedicatedActionOption && (
                <DedicatedActionOption {...(selected && { selected })} />
              )}
              {AdditionalDedicatedActions && (
                <AdditionalDedicatedActions {...(selected && { selected })} />
              )}
            </div>
          ),
        },
      }
    : {};
};

export default useDedicatedAction;
