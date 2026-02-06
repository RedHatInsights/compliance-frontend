import React, { Fragment } from 'react';
import propTypes from 'prop-types';
import {
  Content,
  ContentVariants,
  Tooltip,
  Icon,
} from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';

import DateFormat from '@redhat-cloud-services/frontend-components/DateFormat';
import Truncate from '@redhat-cloud-services/frontend-components/Truncate';
import InsightsLink from '@redhat-cloud-services/frontend-components/InsightsLink';
import { ComplianceScore as PresentationalComplianceScore } from 'PresentationalComponents';
import { unsupportedSystemWarningMessage } from '@/constants';

const NEVER = 'Never';

const SystemLink = ({ id, children }) => (
  <InsightsLink app="compliance" to={{ pathname: `/systems/${id}` }}>
    {children}
  </InsightsLink>
);

SystemLink.propTypes = {
  id: propTypes.string,
  children: propTypes.node,
};

export const CustomDisplay = (props) => {
  const {
    os_major_version: osMajorVersion,
    os_minor_version: osMinorVersion,
    showOsInfo = false,
    showLink = false,
    idProperty = 'id',
    nameProperty = 'display_name',
  } = props;
  const hasOsInfo = (osMajorVersion, osMinorVersion) =>
    !!osMajorVersion && !!osMinorVersion && showOsInfo;

  const customId = props[idProperty];
  const customName = props[nameProperty];

  return (
    <Content>
      {showLink ? (
        <SystemLink {...{ id: customId }}>{customName}</SystemLink>
      ) : (
        { customName }
      )}

      {hasOsInfo(osMajorVersion, osMinorVersion) && (
        <Content component={ContentVariants.small}>
          RHEL {osMajorVersion}.{osMinorVersion}
        </Content>
      )}
    </Content>
  );
};

CustomDisplay.propTypes = {
  id: propTypes.string,
  display_name: propTypes.string,
  os_major_version: propTypes.string,
  os_minor_version: propTypes.string,
  showOsInfo: propTypes.bool,
  showLink: propTypes.bool,
  idProperty: propTypes.string,
  nameProperty: propTypes.string,
};

export const Name = ({
  id,
  display_name: name,
  os_major_version: osMajorVersion,
  os_minor_version: osMinorVersion,
  showOsInfo = false,
  showLink = false,
}) => {
  const hasOsInfo = (osMajorVersion, osMinorVersion) =>
    !!osMajorVersion && !!osMinorVersion && showOsInfo;

  return (
    <Content>
      {showLink ? <SystemLink {...{ id }}>{name}</SystemLink> : name}

      {hasOsInfo(osMajorVersion, osMinorVersion) && (
        <Content component={ContentVariants.small}>
          RHEL {osMajorVersion}.{osMinorVersion}
        </Content>
      )}
    </Content>
  );
};

Name.propTypes = {
  id: propTypes.string,
  display_name: propTypes.string,
  os_major_version: propTypes.string,
  os_minor_version: propTypes.string,
  showOsInfo: propTypes.bool,
  showLink: propTypes.bool,
};

export const SSGVersion = ({ ssgVersion = 'Not available', supported }) =>
  supported ? (
    ssgVersion
  ) : (
    <>
      <Tooltip content={unsupportedSystemWarningMessage}>
        <Icon status="warning">
          <ExclamationTriangleIcon />
        </Icon>
      </Tooltip>
      {' ' + ssgVersion}
    </>
  );

SSGVersion.propTypes = {
  supported: propTypes.bool,
  ssgVersion: propTypes.string,
};

export const SSGVersions = ({ security_guide_version, supported }) =>
  security_guide_version ? (
    <SSGVersion ssgVersion={security_guide_version} supported={supported} />
  ) : (
    'Unknown'
  );

SSGVersions.propTypes = {
  security_guide_version: propTypes.string,
  supported: propTypes.bool,
};

const getTruncateLength = (policies) => {
  const additionalCharLength = 4; // for the commas and spaces
  if ((policies || []).length > 2) {
    return (
      policies[0].title.length + policies[1].title.length + additionalCharLength
    );
  }
  return 215;
};

export const Policies = ({ policies }) => {
  const truncateLength = getTruncateLength(policies);

  return (
    (policies || []).length && (
      <Truncate
        inline
        text={policies.map((p) => p.title).join(', ')}
        length={truncateLength}
      />
    )
  );
};

Policies.propTypes = {
  policies: propTypes.array,
};

export const FailedRules = ({ system_id, failed_rule_count }) => {
  return <SystemLink {...{ id: system_id }}>{failed_rule_count}</SystemLink>;
};

FailedRules.propTypes = {
  system_id: propTypes.string,
  failed_rule_count: propTypes.number,
};

export const ComplianceScore = ({ score, supported, compliant }) => {
  return <PresentationalComplianceScore {...{ score, supported, compliant }} />;
};

ComplianceScore.propTypes = {
  score: propTypes.number,
  supported: propTypes.bool,
  compliant: propTypes.bool,
};

const NeverScanned = () => (
  <Tooltip
    position="right"
    content={
      <Fragment>
        This system has never returned a report for this policy. This may be
        because it is disconnected, or the insights-client on this system is not
        configured to use Compliance.
      </Fragment>
    }
  >
    <span>
      <ExclamationTriangleIcon color="var(--pf-t--global--color--status--warning--100)" />
      {' ' + NEVER}
    </span>
  </Tooltip>
);

const parseValidDate = (dateString) => {
  const date = dateString ? new Date(dateString) : null;
  return date && isFinite(date) ? date : null;
};

export const lastScanned = (lastScannedTime) => {
  const validDate = parseValidDate(lastScannedTime);
  return validDate || NEVER;
};

export const LastScanned = ({ end_time: lastScannedTime }) => {
  const validDate = parseValidDate(lastScannedTime);

  return validDate ? (
    <DateFormat date={Date.parse(validDate)} type="relative" />
  ) : (
    <NeverScanned />
  );
};

LastScanned.propTypes = {
  end_time: propTypes.string,
};

export const operatingSystemString = ({ os_minor_version, os_major_version }) =>
  `RHEL ${os_major_version}.${os_minor_version}`;

export const OperatingSystem = (system) => operatingSystemString(system);
