import React from 'react';
import { RebootingIcon } from '@patternfly/react-icons';
import propTypes from 'prop-types';
import useStateCallbacks from '@/Frameworks/AsyncTableTools/hooks/useTableState/hooks/useStateCallbacks';

const ResetRules = () => {
  const callbacks = useStateCallbacks();

  const resetSelectionCallback = () => {
    callbacks?.current?.resetSelection?.();
  };
  return (
    <a className="pf-v6-u-ml-lg pf-v6-u-mr-xl" onClick={resetSelectionCallback}>
      <RebootingIcon className="pf-v6-u-mr-sm" />
      Reset to default
    </a>
  );
};

ResetRules.propTypes = {
  handleSelect: propTypes.func,
  updateRules: propTypes.any,
  profile: propTypes.any,
  newOsMinorVersion: propTypes.any,
  originalRules: propTypes.array,
  loading: propTypes.bool,
  selectedRuleRefIds: propTypes.array,
};

export default ResetRules;
