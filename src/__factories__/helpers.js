export const callAndSort = (func, count, options = {}) => {
  const { sortBy, offset, funcArguments } = options;
  const callArguments = (currentCount) => [
    currentCount + (offset || 0),
    ...(funcArguments || []),
  ];

  return [...new Array(count)]
    .map((_, currentCount) => {
      return func(...callArguments(currentCount));
    })
    .sort((item) => item[sortBy || 'id']);
};
