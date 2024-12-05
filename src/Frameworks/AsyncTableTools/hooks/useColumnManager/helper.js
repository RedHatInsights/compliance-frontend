export const getFixedColumns = (columns = []) =>
  columns.map((column, idx) => ({
    manageable: column.manageable === undefined ? true : column.manageable,
    isUntoggleable: idx === 0,
    isShownByDefault: true,
    isShown: true,
    ...column,
  }));
