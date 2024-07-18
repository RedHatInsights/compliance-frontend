import useSelectionManager from '../useSelectionManager';

// NOTE: This expanding is, i believe only used in the list view of the RulesTable
/**
 * Provides props for a Patternfly table to manage expandable items/rows.
 *
 */
const useExpandable = () => {
  const { selection: openItems, toggle } = useSelectionManager([]);

  const onCollapse = (_event, _index, _isOpen, { itemId }) => toggle(itemId);

  // TODO This function will be passed as a "rowTransformer" to the `rowsBuilder`, to "open" a row
  // This means it needs to check if the id of the current row is "selected" and also render the "DetailsRow" component as an additional row
  const openItem = (row) => {};

  return {
    openItem,
    openItems,
    tableProps: {
      onCollapse,
    },
  };
};

export default useExpandable;
