import React, { useState } from 'react';
import { TableContext } from '../';

const TableToolsProvider = ({ children }) => {
  // TODO For now, this is good enough,
  // but we should consider using something more sophisticated for name-spaced states. maybe.
  // For example the `useSelectionManager`
  const [tableState, setTableState] = useState({});

  return (
    <TableContext.Provider value={{ tableState, setTableState }}>
      {children}
    </TableContext.Provider>
  );
};

export default TableToolsProvider;
