import React from 'react';
import {
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  QuestionCircleIcon,
} from '@patternfly/react-icons';
import { LowSeverityIcon } from './Cells';

export const HIGH_SEVERITY = (
  <span>
    <ExclamationCircleIcon className="ins-u-failed" /> High
  </span>
);
export const MEDIUM_SEVERITY = (
  <span>
    <ExclamationTriangleIcon className="ins-u-warning" /> Medium
  </span>
);
export const LOW_SEVERITY = (
  <span>
    <LowSeverityIcon /> Low
  </span>
);
export const UNKNOWN_SEVERITY = (
  <span>
    <QuestionCircleIcon /> Unknown
  </span>
);
