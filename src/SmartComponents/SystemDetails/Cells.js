import React from 'react';
import propTypes from 'prop-types';
import { Content, Icon } from '@patternfly/react-core';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@patternfly/react-icons';
import RemediationCell from '@/PresentationalComponents/RemediationCell/RemediationCell';
import { Policy, Severity } from '@/PresentationalComponents/RulesTable/Cells';

const ruleResultProps = {
  title: propTypes.string,
  severity: propTypes.string,
  result: propTypes.string,
  remediation_issue_id: propTypes.string,
};

export const Rule = ({ title, result = 'pass' }) => {
  return (
    <Content
      style={{
        ...(result === 'fail'
          ? {
              fontWeight: 'bold',
              color: 'var(--pf-t--global--color--status--danger--100)',
            }
          : {}),
      }}
    >
      {title}
    </Content>
  );
};
Rule.propTypes = ruleResultProps;

export const Passed = ({ result }) =>
  result === 'pass' ? (
    <Icon status="success">
      <CheckCircleIcon className="ins-u-passed" />
    </Icon>
  ) : (
    <Icon status="danger">
      <ExclamationCircleIcon className="ins-u-failed" />
    </Icon>
  );
Passed.propTypes = ruleResultProps;

export const RemediationColumnCell = ({ remediation_issue_id }) => (
  <RemediationCell hasPlaybook={remediation_issue_id !== null} />
);
RemediationColumnCell.propTypes = ruleResultProps;

export { Severity, Policy };
