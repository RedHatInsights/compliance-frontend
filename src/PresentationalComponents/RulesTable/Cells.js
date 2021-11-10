import React from 'react';
import propTypes from 'prop-types';
import { Text, TextVariants, TextContent } from '@patternfly/react-core';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  QuestionCircleIcon,
} from '@patternfly/react-icons';
import RemediationCell from '../RemediationCell/RemediationCell';
const ruleProps = {
  title: propTypes.string,
  identifier: propTypes.object,
  profile: propTypes.object,
  compliant: propTypes.bool,
  remediationAvailable: propTypes.bool,
  severity: propTypes.string,
};

export const Rule = ({ title, identifier }) => (
  <TextContent>
    {title}
    {identifier ? (
      <Text component={TextVariants.small}>{identifier.label}</Text>
    ) : (
      ''
    )}
  </TextContent>
);
Rule.propTypes = ruleProps;

export const Policy = ({ profile }) => profile.name;
Policy.propTypes = ruleProps;

export const HighSeverity = () => (
  <span>
    <ExclamationCircleIcon className="ins-u-failed" /> High
  </span>
);

export const MediumSeverity = () => (
  <span>
    <ExclamationTriangleIcon className="ins-u-warning" /> Medium
  </span>
);

export const LowSeverityIcon = () => (
    <svg width="1em" height="1em" viewBox="0 0 18 18" role="img" style={ { verticalAlign: '-0.125em' } } xmlns="http://www.w3.org/2000/svg"><path d="M2 0h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm6.67 10.46a1.67 1.67 0 1 0 0 3.338 1.67 1.67 0 0 0 0-3.338zm-1.586-6l.27 4.935a.435.435 0 0 0 .434.411H9.55c.232 0 .422-.18.435-.411l.27-4.936A.435.435 0 0 0 9.818 4h-2.3c-.25 0-.448.21-.435.46z" fill="#3A9CA6" fillRule="evenodd"/></svg> // eslint-disable-line
);

export const LowSeverity = () => (
  <span>
    <LowSeverityIcon /> Low
  </span>
);

export const UnknownSeverity = () => (
  <span>
    <QuestionCircleIcon /> Unknown
  </span>
);

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

export const RemediatonColumnCell = ({ remediationAvailable }) => (
  <RemediationCell hasPlaybook={remediationAvailable} />
);
RemediatonColumnCell.propTypes = ruleProps;
