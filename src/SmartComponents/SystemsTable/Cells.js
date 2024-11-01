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
  ComplianceScore as PresentationalComplianceScore,
  LinkWithPermission as Link,
} from 'PresentationalComponents';
import { complianceScoreData, NEVER } from 'Utilities/ruleHelpers';

const SystemLink = ({ id, children }) => (
  <Link to={{ pathname: `/systems/${id}` }}>{children}</Link>
);

SystemLink.propTypes = {
  id: propTypes.string,
  children: propTypes.node,
};

export const CustomDisplay = (props) => {
  const {
    osMajorVersion,
    osMinorVersion,
    showOsInfo = false,
    showLink = false,
    idProperty = 'id',
    nameProperty = 'name',
  } = props;
  const hasOsInfo = (osMajorVersion, osMinorVersion) =>
    !!osMajorVersion && !!osMinorVersion && showOsInfo;

  const customId = props[idProperty];
  const customName = props[nameProperty];

  return (
    <TextContent>
      {showLink ? (
        <SystemLink {...{ id: customId }}>{customName}</SystemLink>
      ) : (
        { customName }
      )}

      {hasOsInfo(osMajorVersion, osMinorVersion) && (
        <Text component={TextVariants.small}>
          RHEL {osMajorVersion}.{osMinorVersion}
        </Text>
      )}
    </TextContent>
  );
};

CustomDisplay.propTypes = {
  id: propTypes.string,
  name: propTypes.string,
  osMajorVersion: propTypes.string,
  osMinorVersion: propTypes.string,
  showOsInfo: propTypes.bool,
  showLink: propTypes.bool,
  idProperty: propTypes.string,
  nameProperty: propTypes.string,
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
    ? testResultProfiles.map((profile) => {
        return (
          <SSGVersion
            key={`ssgversion-${profile.id}`}
            ssgVersion={profile?.benchmark?.version}
            supported={profile?.supported}
          />
        );
      })
    : 'Unknown';

SSGVersions.propTypes = {
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
  const rulesFailed = testResultProfiles.reduce(
    (acc, { rulesFailed }) => acc + parseInt(rulesFailed || 0),
    0
  );

  return (
    <SystemLink {...{ id }}>{rulesFailed > 0 ? rulesFailed : 'N/A'}</SystemLink>
  );
};

FailedRules.propTypes = {
  id: propTypes.string,
  testResultProfiles: propTypes.array,
};

export const FailedRulesRest = ({ system_id, rulesFailed }) => {
  return (
    <SystemLink {...{ id: system_id }}>
      {rulesFailed > 0 ? rulesFailed : 'N/A'}
    </SystemLink>
  );
};

FailedRulesRest.propTypes = {
  system_id: propTypes.string,
  rulesFailed: propTypes.number,
};

export { complianceScoreData };
export const ComplianceScore = ({ testResultProfiles }) => {
  const { score, supported, compliant } = testResultProfiles[0] || {};
  return testResultProfiles.length > 0 ? (
    <PresentationalComplianceScore {...{ score, supported, compliant }} />
  ) : (
    'N/A'
  );
};

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
    <div>
      <ExclamationTriangleIcon color="var(--pf-v5-global--warning-color--100)" />
      {' ' + NEVER}
    </div>
  </Tooltip>
);

export const lastScanned = (profiles) => {
  if (!profiles || profiles?.length === 0) {
    return <NeverScanned />;
  }
  const dates = profiles?.map((profile) => new Date(profile.lastScanned));
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
  const lastScannedDate = lastScanned(profiles ?? []);

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
