import React from 'react';
import propTypes from 'prop-types';
import { TextContent } from '@patternfly/react-core';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@patternfly/react-icons';

import {
  HighSeverity,
  MediumSeverity,
  LowSeverity,
  UnknownSeverity,
} from '../../PresentationalComponents/RulesTable/components/SeverityIcons';
import RemediationCell from '../../PresentationalComponents/RemediationCell/RemediationCell';

const ruleResultProps = {
  title: propTypes.string,
  severity: propTypes.string,
  result: propTypes.string,
  remediation_issue_id: propTypes.string,
};

export const Rule = ({ title, result = 'pass' }) => {
  return (
    <TextContent
      style={{
        ...(result === 'fail'
          ? {
              fontWeight: 'bold',
              color: 'var(--pf-v5-global--danger-color--100)',
            }
          : {}),
      }}
    >
      {title}
    </TextContent>
  );
};
Rule.propTypes = ruleResultProps;

export const Policy = ({ profile }) => profile.name;
Policy.propTypes = ruleResultProps;

export const Severity = ({ severity }) =>
  ({
    high: <HighSeverity />,
    medium: <MediumSeverity />,
    low: <LowSeverity />,
  }[severity?.toLowerCase()] || <UnknownSeverity />);
Severity.propTypes = ruleResultProps;

export const Passed = ({ result }) =>
  result === 'pass' ? (
    <CheckCircleIcon className="ins-u-passed" />
  ) : (
    <ExclamationCircleIcon className="ins-u-failed" />
  );
Passed.propTypes = ruleResultProps;

export const RemediationColumnCell = ({ remediation_issue_id }) => (
  <RemediationCell hasPlaybook={remediation_issue_id} />
);
RemediationColumnCell.propTypes = ruleResultProps;
