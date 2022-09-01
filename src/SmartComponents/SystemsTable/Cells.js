import React, { Fragment } from 'react';
import propTypes from 'prop-types';
import {
  Text,
  TextContent,
  TextVariants,
  Tooltip,
} from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';

import DateFormat from '@redhat-cloud-services/frontend-components/DateFormat';
import Truncate from '@redhat-cloud-services/frontend-components/Truncate';
import {
  UnsupportedSSGVersion,
  ComplianceScore as complianceScore,
  LinkWithPermission as Link,
} from 'PresentationalComponents';
import {
  profilesRulesFailed,
  complianceScoreData,
  NEVER,
} from 'Utilities/ruleHelpers';

const SystemLink = ({ id, children }) => (
  <Link to={{ pathname: `/systems/${id}` }}>{children}</Link>
);

SystemLink.propTypes = {
  id: propTypes.string,
  children: propTypes.node,
};

export const Name = ({
  id,
  name,
  osMajorVersion,
  osMinorVersion,
  showOsInfo = false,
  showLink = false,
}) => {
  const hasOsInfo = (osMajorVersion, osMinorVersion) =>
    !!osMajorVersion && !!osMinorVersion && showOsInfo;

  return (
    <TextContent>
      {showLink ? <SystemLink {...{ id }}>{name}</SystemLink> : name}

      {hasOsInfo(osMajorVersion, osMinorVersion) && (
        <Text component={TextVariants.small}>
          RHEL {osMajorVersion}.{osMinorVersion}
        </Text>
      )}
    </TextContent>
  );
};

Name.propTypes = {
  id: propTypes.string,
  name: propTypes.string,
  osMajorVersion: propTypes.string,
  osMinorVersion: propTypes.string,
  showOsInfo: propTypes.bool,
  showLink: propTypes.bool,
};

export const profilesSsgVersions = (profiles) =>
  profiles
    .map((p) => p.ssgVersion)
    .filter((version) => !!version)
    .join(', ');

export const SSGVersion = ({ ssgVersion = 'Not available', supported }) =>
  supported ? (
    ssgVersion
  ) : (
    <UnsupportedSSGVersion messageVariant="singular">
      {ssgVersion}
    </UnsupportedSSGVersion>
  );

SSGVersion.propTypes = {
  supported: propTypes.bool,
  ssgVersion: propTypes.string,
};

export const SSGVersions = ({ testResultProfiles = [] }) =>
  testResultProfiles.length !== 0
    ? testResultProfiles.map((profile) => (
        <SSGVersion
          key={`ssgversion-${profile.id}`}
          ssgVersion={profile?.benchmark?.version}
          supported={profile?.supported}
        />
      ))
    : 'Unknown';

SSGVersions.propTypes = {
  testResultProfiles: propTypes.array,
};

export const DetailsLink = ({ id, testResultProfiles = [] }) =>
  testResultProfiles.length > 0 ? (
    <SystemLink {...{ id }}>View Report</SystemLink>
  ) : (
    ''
  );

DetailsLink.propTypes = {
  id: propTypes.string,
  testResultProfiles: propTypes.array,
};

export const Policies = ({ policies }) =>
  (policies || []).length > 0 && (
    <Truncate
      inline
      text={policies.map((p) => p.name).join(', ')}
      length={215}
    />
  );

Policies.propTypes = {
  policies: propTypes.array,
};

export const FailedRules = ({ id, testResultProfiles }) => {
  const rulesFailed = profilesRulesFailed(testResultProfiles).length;
  return (
    <SystemLink {...{ id }}>
      {testResultProfiles.length > 0 ? rulesFailed : 'N/A'}
    </SystemLink>
  );
};

FailedRules.propTypes = {
  id: propTypes.string,
  testResultProfiles: propTypes.array,
};

export { complianceScoreData };
export const ComplianceScore = ({ testResultProfiles }) =>
  testResultProfiles.length > 0
    ? complianceScore(complianceScoreData(testResultProfiles))
    : 'N/A';

ComplianceScore.propTypes = {
  testResultProfiles: propTypes.array,
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
    <ExclamationTriangleIcon color="var(--pf-global--warning-color--100)" />
    {' ' + NEVER}
  </Tooltip>
);

export const lastScanned = (profiles) => {
  const dates = profiles.map((profile) => new Date(profile.lastScanned));
  const last = new Date(
    Math.max.apply(
      null,
      dates.filter((date) => isFinite(date))
    )
  );
  const result =
    last instanceof Date && isFinite(last) ? last : <NeverScanned />;

  return result;
};

export const LastScanned = ({ testResultProfiles: profiles }) => {
  const lastScannedDate = lastScanned(profiles || []);

  return lastScannedDate instanceof Date ? (
    <DateFormat date={Date.parse(lastScannedDate)} type="relative" />
  ) : (
    lastScannedDate
  );
};

LastScanned.propTypes = {
  testResultProfiles: propTypes.array,
};

export const operatingSystemString = ({ osMinorVersion, osMajorVersion }) =>
  `RHEL ${osMajorVersion}.${osMinorVersion}`;

export const OperatingSystem = (system) => operatingSystemString(system);
