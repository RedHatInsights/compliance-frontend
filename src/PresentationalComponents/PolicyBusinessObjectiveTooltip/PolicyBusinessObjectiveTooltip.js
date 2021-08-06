import React, { Fragment } from 'react';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import { Tooltip } from '@patternfly/react-core';

const PolicyBusinessObjectiveTooltip = () => (
  <Tooltip
    position="right"
    content={
      <Fragment>
        This is an optional field that can be used to label policies that are
        related to specific business objectives.
      </Fragment>
    }
  >
    <span>
      &nbsp;
      <OutlinedQuestionCircleIcon className="grey-icon" />
    </span>
  </Tooltip>
);

export default PolicyBusinessObjectiveTooltip;
