const prependEmptyFirstAction = (actions) => [undefined, ...actions];

const useToolbarActions = ({ actions: actionsOption = [] }) => {
  const actions = prependEmptyFirstAction(actionsOption);

  return {
    toolbarProps: {
      actionsConfig: {
        actions,
      },
    },
  };
};

export default useToolbarActions;
