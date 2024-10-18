import React from 'react';

// TODO rethink when and how this should build actions and how to integrate actions
// consider a "useTableActions" hook, which should handle table and row actions, etc.
export const toToolbarActions = ({
  actions: actionsOption = [],
  firstAction: PrimaryAction = undefined,
}) =>
  actionsOption?.length || PrimaryAction
    ? {
        toolbarProps: {
          actionsConfig: {
            actions: [
              PrimaryAction && <PrimaryAction key="primaryAction" />,
              ...actionsOption,
            ],
          },
        },
      }
    : {};
