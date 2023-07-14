import React, { useCallback, useMemo, useState } from 'react';
import TreeTableToggle from './Components/TreeTableToggle';

const useTreeTable = (options) => {
  const enableTreeTable = !!options.tableTree;
  const [tableType, setTableType] = useState('tree');

  const onToggle = useCallback(() => {
    if (tableType === 'list') {
      setTableType('tree');
    } else {
      setTableType('list');
    }
  }, [tableType]);

  const Toggle = useMemo(() => {
    const T = () => (
      <TreeTableToggle onToggle={onToggle} tableType={tableType} />
    );
    return T;
  }, [tableType]);

  return enableTreeTable
    ? {
        toolbarProps: {
          variant: 'compact',
        },
        showTreeTable: tableType === 'tree',
        tableType,
        setTableType,
        TreeTableToggle: Toggle,
      }
    : {};
};

export default useTreeTable;
