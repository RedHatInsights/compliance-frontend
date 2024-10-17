import React from 'react';
import propTypes from 'prop-types';
import { Text, TextVariants, TextContent } from '@patternfly/react-core';
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
    <TextContent
      style={{
        ...(!compliant
          ? {
              fontWeight: 'bold',
              color: 'var(--pf-v5-global--danger-color--100)',
            }
          : {}),
      }}
    >
      {title}
      {identifier ? (
        <Text component={TextVariants.small}>{identifier.label}</Text>
      ) : (
        ''
      )}
    </TextContent>
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
  }[severity?.toLowerCase()] || <UnknownSeverity />);
Severity.propTypes = ruleProps;

export const Passed = ({ compliant }) =>
  compliant ? (
    <CheckCircleIcon className="ins-u-passed" />
  ) : (
    <ExclamationCircleIcon className="ins-u-failed" />
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
