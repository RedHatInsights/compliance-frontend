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

export default useRadioSelect;
