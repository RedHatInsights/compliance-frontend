import React from 'react';
import { Icon } from '@patternfly/react-core';

import {
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  QuestionCircleIcon,
} from '@patternfly/react-icons';

const LowSeverityIcon = () => (
    <svg width="1em" height="1em" viewBox="0 0 18 18" role="img" style={ { verticalAlign: '-0.125em' } } xmlns="http://www.w3.org/2000/svg"><path d="M2 0h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm6.67 10.46a1.67 1.67 0 1 0 0 3.338 1.67 1.67 0 0 0 0-3.338zm-1.586-6l.27 4.935a.435.435 0 0 0 .434.411H9.55c.232 0 .422-.18.435-.411l.27-4.936A.435.435 0 0 0 9.818 4h-2.3c-.25 0-.448.21-.435.46z" fill="#3A9CA6" fillRule="evenodd"/></svg> // eslint-disable-line
);

export const HighSeverity = () => (
  <>
    <Icon status="danger" className="pf-v5-u-mr-xs" isInline>
      <ExclamationCircleIcon />
    </Icon>
    High
  </>
);

export const MediumSeverity = () => (
  <>
    <Icon status="warning" className="pf-v5-u-mr-xs" isInline>
      <ExclamationTriangleIcon />
    </Icon>
    Medium
  </>
);

export const LowSeverity = () => (
  <>
    <Icon className="pf-v5-u-mr-xs" isInline>
      <LowSeverityIcon />
    </Icon>
    Low
  </>
);

export const UnknownSeverity = () => (
  <>
    <Icon className="pf-v5-u-mr-xs" isInline>
      <QuestionCircleIcon />
    </Icon>
    Unknown
  </>
);
