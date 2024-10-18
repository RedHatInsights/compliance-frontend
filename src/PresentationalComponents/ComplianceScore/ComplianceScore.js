import React from 'react';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@patternfly/react-icons';
import { Text, Tooltip, Icon } from '@patternfly/react-core';
import { fixedPercentage } from 'Utilities/TextHelper';

const CompliantIcon = (system) => {
  {
    return system.compliant ? (
      <Icon>
        <CheckCircleIcon className="ins-u-passed" />
      </Icon>
    ) : (
      <Icon>
        <ExclamationCircleIcon className="ins-u-failed" />
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
