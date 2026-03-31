import React from 'react';
import { Icon } from '@patternfly/react-core';

import {
  SeverityCriticalIcon,
  SeverityMinorIcon,
  SeverityModerateIcon,
  SeverityUndefinedIcon,
} from '@patternfly/react-icons';

export const HighSeverityChipIcon = () => (
  <Icon
    style={{
      '--pf-v6-c-icon__content--Color':
        'var(--pf-t--global--icon--color--severity--critical--default)',
    }}
    className="pf-v6-u-mr-xs"
    isInline
  >
    <SeverityCriticalIcon />
  </Icon>
);

export const HighSeverity = () => (
  <>
    <HighSeverityChipIcon />
    High
  </>
);

export const MediumSeverityChipIcon = () => (
  <Icon
    style={{
      '--pf-v6-c-icon__content--Color':
        'var(--pf-t--global--icon--color--severity--moderate--default)',
    }}
    className="pf-v6-u-mr-xs"
    isInline
  >
    <SeverityModerateIcon />
  </Icon>
);

export const MediumSeverity = () => (
  <>
    <MediumSeverityChipIcon />
    Medium
  </>
);

export const LowSeverityChipIcon = () => (
  <Icon
    style={{
      '--pf-v6-c-icon__content--Color':
        'var(--pf-t--global--icon--color--severity--minor--default)',
    }}
    className="pf-v6-u-mr-xs minor"
    isInline
  >
    <SeverityMinorIcon />
  </Icon>
);

export const LowSeverity = () => (
  <>
    <LowSeverityChipIcon />
    Low
  </>
);

export const UnknownSeverityChipIcon = () => (
  <Icon
    style={{
      '--pf-v6-c-icon__content--Color':
        'var(--pf-t--global--icon--color--severity--undefined--default)',
    }}
    className="pf-v6-u-mr-xs undefined"
    isInline
  >
    <SeverityUndefinedIcon />
  </Icon>
);

export const UnknownSeverity = () => (
  <>
    <UnknownSeverityChipIcon />
    Unknown
  </>
);
