import React from 'react';
import propTypes from 'prop-types';
import { Button, TextContent, Text, Progress } from '@patternfly/react-core';
import { DownloadIcon } from '@patternfly/react-icons';
import {
  BackgroundLink,
  PolicyPopover,
  GreySmallText,
  UnsupportedSSGVersion,
  LinkWithPermission as Link,
} from 'PresentationalComponents';

export const Name = (profile) => (
  <TextContent>
    <Link to={'/reports/' + profile.id} style={{ marginRight: '.5rem' }}>
      {profile.policy?.name}
    </Link>
    <React.Fragment>
      <PolicyPopover {...{ profile, position: 'right' }} />
      <GreySmallText>{profile.policyType}</GreySmallText>
    </React.Fragment>
  </TextContent>
);

Name.propTypes = {
  profile: propTypes.object,
};

export const OperatingSystem = ({
  osMajorVersion,
  ssgVersion,
  unsupportedHostCount,
  policy,
}) => {
  const supported = unsupportedHostCount === 0;
  ssgVersion = 'SSG: ' + ssgVersion;

  return (
    <React.Fragment>
      RHEL {osMajorVersion}
      {policy === null && ssgVersion && (
        <Text>
          <GreySmallText>
            {supported ? (
              ssgVersion
            ) : (
              <UnsupportedSSGVersion>{ssgVersion}</UnsupportedSSGVersion>
            )}
          </GreySmallText>
        </Text>
      )}
    </React.Fragment>
  );
};

OperatingSystem.propTypes = {
  osMajorVersion: propTypes.string,
  ssgVersion: propTypes.string,
  unsupportedHostCount: propTypes.number,
  policy: propTypes.object,
};

export const CompliantSystems = ({
  testResultHostCount = 0,
  compliantHostCount = 0,
  unsupportedHostCount = 0,
}) => {
  const tooltipText =
    'Insights cannot provide a compliance score for systems running an unsupported ' +
    'version of the SSG at the time this report was created, as the SSG version was not supported by RHEL.';
  return (
    <React.Fragment>
      <Progress
        aria-label="Compliant systems"
        measureLocation={'outside'}
        value={
          testResultHostCount
            ? (100 / testResultHostCount) * compliantHostCount
            : 0
        }
      />
      <GreySmallText>
        {`${compliantHostCount} of ${testResultHostCount} systems `}

        {unsupportedHostCount > 0 && (
          <UnsupportedSSGVersion
            {...{ tooltipText }}
            style={{ marginLeft: '.5em' }}
          >
            <strong className="ins-c-warning-text">
              {unsupportedHostCount} unsupported
            </strong>
          </UnsupportedSSGVersion>
        )}
      </GreySmallText>
    </React.Fragment>
  );
};

CompliantSystems.propTypes = {
  testResultHostCount: propTypes.number,
  compliantHostCount: propTypes.number,
  unsupportedHostCount: propTypes.number,
};

export const PDFExportDownload = ({ id }) => (
  <BackgroundLink
    component={Button}
    ouiaId="ReportsDownloadReportPDFLink"
    variant="plain"
    className="pf-u-mr-md"
    to={`/reports/${id}/pdf`}
  >
    <DownloadIcon />
  </BackgroundLink>
);

PDFExportDownload.propTypes = {
  id: propTypes.string,
};
