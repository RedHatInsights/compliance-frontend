export const getManagableColumns = (columns = []) =>
  columns
    .map((column) =>
      column.manageable === undefined ? { ...column, manageable: true } : column
    )
    .filter((column) => column.manageable === true)
    .map((column, idx) => ({
      isUntoggleable: idx === 0,
      isShownByDefault: true,
      isShown: true,
      ...column,
    }));
