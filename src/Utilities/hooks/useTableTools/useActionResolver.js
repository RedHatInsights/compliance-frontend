const useActionResolver = ({ actionResolver }) => {
  const isActionResolverEnabled = !!actionResolver;
  return isActionResolverEnabled
    ? {
        tableProps: {
          actionResolver,
        },
      }
    : {};
};

export const useActionResolverWithItems = ({ items, ...optionsAndProps }) => {
  const actionResolver =
    items.length > 0
      ? useActionResolver({
          items,
          ...optionsAndProps,
        })
      : {};
  return actionResolver;
};
