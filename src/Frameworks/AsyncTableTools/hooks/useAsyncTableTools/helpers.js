// TODO rethink when and how this should build actions and how to integrate actions
// consider a "useTableActions" hook, which should handle table and row actions, etc.
export const toToolbarActions = ({
  actions: actionsOption = [],
  firstAction = undefined,
}) =>
  actionsOption?.length
    ? {
        toolbarProps: {
          actionsConfig: {
            actions: [firstAction, ...actionsOption],
          },
        },
      }
    : {};
