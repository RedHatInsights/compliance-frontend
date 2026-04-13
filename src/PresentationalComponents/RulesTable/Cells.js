import React from 'react';
import propTypes from 'prop-types';
import { Content, ContentVariants, Icon } from '@patternfly/react-core';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@patternfly/react-icons';
import RemediationCell from '../RemediationCell/RemediationCell';

import {
  HighSeverity,
  MediumSeverity,
  LowSeverity,
  UnknownSeverity,
} from './components/SeverityIcons';

const ruleProps = {
  title: propTypes.string,
  identifier: propTypes.object,
  profile: propTypes.object,
  compliant: propTypes.bool,
  remediationAvailable: propTypes.bool,
  remediation_available: propTypes.bool,
  severity: propTypes.string,
};

export const Rule = ({ title, identifier, compliant = true }) => {
  return (
    <Content
      style={{
        ...(!compliant
          ? {
              fontWeight: 'bold',
              color: 'var(--pf-t--global--color--status--danger--100)',
            }
          : {}),
      }}
    >
      {title}
      {identifier ? (
        <Content component={ContentVariants.small}>{identifier.label}</Content>
      ) : (
        ''
      )}
    </Content>
  );
};
Rule.propTypes = ruleProps;

export const Policy = ({ profile }) => profile.name;
Policy.propTypes = ruleProps;

export const Severity = ({ severity }) =>
  ({
    high: <HighSeverity />,
    medium: <MediumSeverity />,
    low: <LowSeverity />,
  })[severity?.toLowerCase()] || <UnknownSeverity />;
Severity.propTypes = ruleProps;

export const Passed = ({ compliant }) =>
  compliant ? (
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
Passed.propTypes = ruleProps;

export const RemediationColumnCell = ({
  remediationAvailable,
  remediation_available,
}) => (
  <RemediationCell
    hasPlaybook={remediationAvailable || remediation_available}
  />
);
RemediationColumnCell.propTypes = ruleProps;
