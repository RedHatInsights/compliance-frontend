import React from 'react';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@patternfly/react-icons';
import { Content, Tooltip, Icon } from '@patternfly/react-core';
import { fixedPercentage } from 'Utilities/TextHelper';

const CompliantIcon = (system) => {
  {
    return system.compliant ? (
      <Icon status="success">
        <CheckCircleIcon />
      </Icon>
    ) : (
      <Icon status="danger">
        <ExclamationCircleIcon />
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
  <Content component="p">
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
          {' ' + complianceScoreString(system)}
        </span>
      </Tooltip>
    ) : (
      complianceScoreString(system)
    )}
  </Content>
);

export default ComplianceScore;
