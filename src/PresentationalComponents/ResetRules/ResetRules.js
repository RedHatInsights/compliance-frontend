import React from 'react';
import { RebootingIcon } from '@patternfly/react-icons';
import propTypes from 'prop-types';
import useContextOrInternalStateAndRefs from '@/Frameworks/AsyncTableTools/hooks/useTableState/hooks/useContextOrInternalStateAndRefs';

const ResetRules = () => {
  const { callbacks } = useContextOrInternalStateAndRefs();

  const resetSelectionCallback = () => {
    console.log('reset xd');
    callbacks?.current?.resetSelection?.();
  };
  return (
    <a className="pf-v5-u-ml-lg pf-v5-u-mr-xl" onClick={resetSelectionCallback}>
      <RebootingIcon className="pf-v5-u-mr-sm" />
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
