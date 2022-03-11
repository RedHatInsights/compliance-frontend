const useRadioSelect = ({ onRadioSelect, total }) => {
  const isRadioSelectEnabled = !!onRadioSelect;
  return isRadioSelectEnabled && total > 0
    ? {
        tableProps: {
          onSelect: onRadioSelect,
          selectVariant: 'radio',
        },
      }
    : {};
};

export const useRadioSelectWithItems = ({ items, ...options }) => {
  const radioSelect = useRadioSelect({
    items,
    total: items.length,
    ...options,
  });
  return radioSelect;
};
