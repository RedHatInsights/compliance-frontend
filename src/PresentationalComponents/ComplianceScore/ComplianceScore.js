import React from 'react';
import {
  QuestionCircleIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@patternfly/react-icons';
import { Text, Tooltip } from '@patternfly/react-core';
import { fixedPercentage } from 'Utilities/TextHelper';

const CompliantIcon = (system) => {
  if (!system.supported && system.score !== 0) {
    return <QuestionCircleIcon color="var(--pf-global--disabled-color--100)" />;
  } else {
    return system.compliant ? (
      <CheckCircleIcon color="var(--pf-global--success-color--200)" />
    ) : (
      <ExclamationCircleIcon color="var(--pf-global--danger-color--100)" />
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
