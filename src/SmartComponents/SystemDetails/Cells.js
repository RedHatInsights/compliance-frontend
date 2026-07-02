import React from 'react';
import propTypes from 'prop-types';
import { Content, ContentVariants, Icon } from '@patternfly/react-core';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@patternfly/react-icons';
import RemediationCell from '@/PresentationalComponents/RemediationCell/RemediationCell';
import { Severity } from '@/PresentationalComponents/RulesTable/Cells';
import { t_global_text_color_subtle } from '@patternfly/react-tokens';

const ruleResultProps = {
  title: propTypes.string,
  identifier: propTypes.object,
  severity: propTypes.string,
  result: propTypes.string,
  remediation_issue_id: propTypes.string,
};

export const Rule = ({ title, identifier }) => {
  return (
    <Content className="pf-v6-u-font-weight-bold">
      {title}
      {identifier ? (
        <Content
          style={{
            fontWeight: 'normal',
            color: t_global_text_color_subtle.var,
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
    <div>
      <Icon status="success" className="pf-v6-u-mr-xs">
        <CheckCircleIcon />
      </Icon>
      Passed
    </div>
  ) : (
    <div>
      <Icon status="danger" className="pf-v6-u-mr-xs">
        <ExclamationCircleIcon />
      </Icon>
      Failed
    </div>
  );
Passed.propTypes = ruleResultProps;

export const RemediationColumnCell = ({ remediation_issue_id }) => (
  <RemediationCell hasPlaybook={remediation_issue_id !== null} />
);
RemediationColumnCell.propTypes = ruleResultProps;

export { Severity };
