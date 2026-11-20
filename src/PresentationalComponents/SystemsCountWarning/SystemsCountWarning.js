import React from 'react';
import propTypes from 'prop-types';
import { Tooltip, TooltipPosition } from '@patternfly/react-core';
import { WarningText } from 'PresentationalComponents';
import { getTerm } from '@/Utilities/helpers';

const WARNING_TEXT = `Policies without ${getTerm('system', { plural: true, lowercase: true })} will not have reports.`;

const WithOptionalToolTip = ({ showTooltip, children }) =>
  showTooltip ? (
    <Tooltip position={TooltipPosition.bottom} content={WARNING_TEXT}>
      {children}
    </Tooltip>
  ) : (
    children
  );

WithOptionalToolTip.propTypes = {
  showTooltip: propTypes.bool,
  children: propTypes.node,
};

const SystemsCountWarning = ({ count, variant = 'compact' }) => {
  let text;

  switch (variant) {
    case 'count':
      text = count;
      break;
    case 'compact':
      text = `No ${getTerm('system', { plural: true })}`;
      break;
    case 'full':
      text = WARNING_TEXT;
      break;
    default:
      text = count;
  }

  return (
    <WithOptionalToolTip
      showTooltip={variant === 'count' || variant === 'compact'}
    >
      <WarningText>{text}</WarningText>
    </WithOptionalToolTip>
  );
};

SystemsCountWarning.propTypes = {
  count: propTypes.number.isRequired,
  variant: propTypes.string,
};

export { WARNING_TEXT };
export default SystemsCountWarning;
