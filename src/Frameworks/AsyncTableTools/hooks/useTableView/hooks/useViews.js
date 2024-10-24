/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from 'react';
import views from '../views';

const useViews = (tableView = 'loading', items, columns, options) => {
  const supportedViews = useMemo(() => {
    return Object.fromEntries(
      Object.entries(views).filter(([, { checkOptions }]) =>
        checkOptions?.(options)
      )
    );
  }, [JSON.stringify(options)]);

  const choosableViews = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(supportedViews).filter(([, { icon }]) => icon)
      ),
    [supportedViews]
  );
  const tableProps = useMemo(
    () =>
      supportedViews[tableView]?.tableProps?.(items, columns, options) || {},
    [
      supportedViews,
      tableView,
      JSON.stringify(items),
      JSON.stringify(columns),
      JSON.stringify(options),
    ]
  );
  const toolbarProps = useMemo(
    () =>
      supportedViews[tableView]?.toolbarProps?.(items, columns, options) || {},
    [
      supportedViews,
      tableView,
      JSON.stringify(items),
      JSON.stringify(columns),
      JSON.stringify(options),
    ]
  );

  return { tableProps, toolbarProps, choosableViews };
};

export default useViews;
