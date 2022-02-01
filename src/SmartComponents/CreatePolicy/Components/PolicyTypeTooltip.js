import React from 'react';
import { Tooltip } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';

const PolicyTypeTooltip = () => (
  <Tooltip
    position="right"
    content="Policy types are OpenSCAP policies that are supported by RHEL.
        For each major version of RHEL, users can create one policy of each type."
  >
    <OutlinedQuestionCircleIcon className="grey-icon" />
  </Tooltip>
);

export default PolicyTypeTooltip;
