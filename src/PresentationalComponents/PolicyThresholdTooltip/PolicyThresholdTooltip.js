import React, { Fragment } from 'react';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import { Tooltip } from '@patternfly/react-core';

const PolicyThresholdTooltip = () => (
  <Tooltip
    position="right"
    content={
      <Fragment>
        The compliance threshold defines what percentage of rules must be met in
        order for a system to be determined &quot;compliant&quot;.
      </Fragment>
    }
  >
    <span>
      &nbsp;
      <OutlinedQuestionCircleIcon className="grey-icon" />
    </span>
  </Tooltip>
);

export default PolicyThresholdTooltip;
