import React from 'react';
import {
  QuestionCircleIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@patternfly/react-icons';
import { Text, Tooltip, Icon } from '@patternfly/react-core';
import { fixedPercentage } from 'Utilities/TextHelper';

const CompliantIcon = (system) => {
  if (!system.supported && system.score !== 0) {
    return (
      <Icon color="var(--pf-v5-global--disabled-color--100)">
        <QuestionCircleIcon />
      </Icon>
    );
  } else {
    return system.compliant ? (
      <Icon color="var(--pf-v5-global--success-color--200)">
        <CheckCircleIcon />
      </Icon>
    ) : (
      <Icon>
        <ExclamationCircleIcon color="var(--pf-v5-global--danger-color--100)" />
      </Icon>
    );
  }
};

export const complianceScoreString = (system) => {
  if (!system.supported) {
    return ' Unsupported';
  } else if (!system.score && system.score !== 0) {
    return ' N/A';
  } else {
    return ' ' + fixedPercentage(system.score);
  }
};

const ComplianceScore = (system) => (
  <Text>
    {system.supported ? (
      <Tooltip
        content={
          'The system compliance score is calculated by OpenSCAP and ' +
          'is a normalized weighted sum of rules selected for this policy.'
        }
      >
        <span>
          <CompliantIcon
            key={`system-compliance-icon-${system.id}`}
            {...system}
          />
          {complianceScoreString(system)}
        </span>
      </Tooltip>
    ) : (
      complianceScoreString(system)
    )}
  </Text>
);

export default ComplianceScore;
