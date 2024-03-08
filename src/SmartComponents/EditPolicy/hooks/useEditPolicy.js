import { useMemo } from 'react';
import useOnSavePolicy from 'Utilities/hooks/useOnSavePolicy';
import { profilesWithRulesToSelection } from 'PresentationalComponents/TabbedRules';

export const initialFormValues = (policy) => {
  const rules = profilesWithRulesToSelection(
    policy?.policy?.profiles?.filter(({ osMinorVersion }) => !!osMinorVersion)
  );
  console.log('Form init', policy, rules);
  return {
    systems: policy?.hosts || [],
    rules,
  };
};

const useEditPolicy = (policy, { onSave } = {}) => {
  const [isSaving, onPolicySave] = useOnSavePolicy({
    onSave: onSave || (() => ({})),
    onError: onSave,
  });

  const initialValues = useMemo(() => {
    const init = initialFormValues(policy);
    console.log('INIT', init);
    return init;
  }, [policy]);

  return {
    initialValues,
    isSaving,
    onSave: onPolicySave,
  };
};

export default useEditPolicy;
