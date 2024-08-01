const prependEmptyFirstAction = (actions) => [undefined, ...actions];

export const toToolbarActions = ({ actions: actionsOption = [] }) => {
  const actions = prependEmptyFirstAction(actionsOption);

  return {
    toolbarProps: {
      actionsConfig: {
        actions,
      },
    },
  };
};
