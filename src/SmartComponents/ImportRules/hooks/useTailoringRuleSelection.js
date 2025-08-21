import { useEffect, useCallback, useMemo, useState } from 'react';

import useTailoringRules from 'Utilities/hooks/api/useTailoringRules';

const useTailoringRuleSelection = ({
  tailoringId,
  policyId,
  osMinorVersion,
}) => {
  const [selection, setSelection] = useState();

  const {
    loading,
    data: { data: tailoringRules } = {},
    error,
  } = useTailoringRules({
    params: { policyId, tailoringId },
    batched: true,
    skip: !policyId || !tailoringId,
  });
  const initialSelection = useMemo(
    () => tailoringRules?.map(({ ref_id }) => ref_id),
    [tailoringRules],
  );

  const onSelect = useCallback(
    (ruleRefId) => {
      setSelection((currentSelection) => {
        if (currentSelection.includes(ruleRefId)) {
          return currentSelection.filter(
            (selectedRefId) => ruleRefId !== selectedRefId,
          );
        } else {
          return [...currentSelection, ruleRefId];
        }
      });
    },
    [setSelection],
  );

  useEffect(() => {
    if (typeof osMinorVersion === 'undefined' || osMinorVersion === '') {
      setSelection(initialSelection);
    }
  }, [setSelection, osMinorVersion, initialSelection]);

  useEffect(() => {
    if (tailoringRules) {
      setSelection(tailoringRules.map(({ ref_id }) => ref_id));
    }
  }, [tailoringRules]);

  return {
    loading,
    initialSelection,
    error,
    selection,
    onSelect,
  };
};

export default useTailoringRuleSelection;
