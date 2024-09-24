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
  const actionResolver = useActionResolver({
    items,
    ...optionsAndProps,
  });

  return items.length > 0 ? actionResolver : {};
};
