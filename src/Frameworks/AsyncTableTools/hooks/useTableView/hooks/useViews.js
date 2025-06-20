import { useDeepCompareMemo } from 'use-deep-compare';
import views from '../views';

const useViews = (tableView = 'loading', items, columns, options) => {
  const supportedViews = useDeepCompareMemo(() => {
    return Object.fromEntries(
      Object.entries(views).filter(([, { checkOptions }]) =>
        checkOptions?.(options),
      ),
    );
  }, [options]);

  const choosableViews = useDeepCompareMemo(
    () =>
      Object.fromEntries(
        Object.entries(supportedViews).filter(([, { icon }]) => icon),
      ),
    [supportedViews],
  );
  const tableProps = useDeepCompareMemo(
    () =>
      supportedViews[tableView]?.tableProps?.(items, columns, options) || {},
    [supportedViews, tableView, items, columns, options],
  );
  const toolbarProps = useDeepCompareMemo(
    () =>
      supportedViews[tableView]?.toolbarProps?.(items, columns, options) || {},
    [supportedViews, tableView, items, columns, options],
  );

  return { tableProps, toolbarProps, choosableViews };
};

export default useViews;
