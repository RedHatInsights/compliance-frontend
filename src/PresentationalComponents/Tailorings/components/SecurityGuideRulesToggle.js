import React from 'react';
import propTypes from 'prop-types';
import { Switch } from '@patternfly/react-core';
import useTableState from '@/Frameworks/AsyncTableTools/hooks/useTableState';

const SecurityGuideRulesToggle = () => {
  const [selectedOnly, setSelectedOnly] = useTableState(
    'selectedRulesOnly',
    true
  );

  return (
    <Switch
      label="Selected only"
      isChecked={selectedOnly}
      onChange={() => setSelectedOnly(!selectedOnly)}
    />
  );
};

SecurityGuideRulesToggle.propTypes = {
  isChecked: propTypes.bool,
  setActiveFilter: propTypes.func,
};

export default SecurityGuideRulesToggle;
