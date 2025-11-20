import React from 'react';
import propTypes from 'prop-types';
import { Content, ContentVariants, Icon } from '@patternfly/react-core';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@patternfly/react-icons';
import RemediationCell from '@/PresentationalComponents/RemediationCell/RemediationCell';
import { Policy, Severity } from '@/PresentationalComponents/RulesTable/Cells';
import { FAILED_RULE_STATES } from '@/constants';

const ruleResultProps = {
  title: propTypes.string,
  identifier: propTypes.object,
  severity: propTypes.string,
  result: propTypes.string,
  remediation_issue_id: propTypes.string,
};

export const Rule = ({ title, identifier, result = 'pass' }) => {
  return (
    <Content
      style={{
        ...(FAILED_RULE_STATES.includes(result)
          ? {
              fontWeight: 'bold',
              color: 'var(--pf-t--global--color--status--danger--100)',
            }
          : {}),
      }}
    >
      {title}
      {identifier ? (
        <Content
          style={{
            fontWeight: 'normal',
            color: 'var(--pf-t--global--text--color--200)',
          }}
          component={ContentVariants.small}
        >
          {identifier.label}
        </Content>
      ) : (
        ''
      )}
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
