import React from 'react';
import propTypes from 'prop-types';
import { Label, Tooltip } from '@patternfly/react-core';

const InUseProfileLabel = ({ compact }) => (
  <Tooltip
    position="right"
    content="A policy of this type is already in use.
        Only one policy per policy type can be created for a major release of RHEL."
  >
    <Label
      color="orange"
      style={{ lineHeight: '1.5em', marginRight: '16px' }}
      compact={compact}
    >
      In use
    </Label>
  </Tooltip>
);

InUseProfileLabel.propTypes = {
  compact: propTypes.boolean,
};

export default InUseProfileLabel;
