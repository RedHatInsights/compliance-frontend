import React from 'react';
import propTypes from 'prop-types';
import { TextContent, Text } from '@patternfly/react-core';
import { DownloadIcon } from '@patternfly/react-icons';
import {
  BackgroundLink,
  PolicyPopover,
  GreySmallText,
  UnsupportedSSGVersion,
  LinkWithPermission as Link,
  ReportStatusBar,
  LinkButton,
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
  unsupportedHostCount,
  benchmark: { ssgVersion },
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
              ssgVersionLabel
            ) : (
              <UnsupportedSSGVersion>{ssgVersionLabel}</UnsupportedSSGVersion>
            )}
          </GreySmallText>
        </Text>
      )}
    </React.Fragment>
  );
};

OperatingSystem.propTypes = {
  osMajorVersion: propTypes.string,
  benchmark: propTypes.object,
  unsupportedHostCount: propTypes.number,
  policy: propTypes.object,
};

export const CompliantSystems = ({
  testResultHostCount = 0,
  compliantHostCount = 0,
  unsupportedHostCount = 0,
  totalHostCount = 0,
}) => {
  const tooltipText =
    'Insights cannot provide a compliance score for systems running an unsupported ' +
    'version of the SSG at the time this report was created, as the SSG version was not supported by RHEL.';
  return (
    <React.Fragment>
      <ReportStatusBar
        hostCounts={{
          totalResults: testResultHostCount,
          compliant: compliantHostCount,
          unsupported: unsupportedHostCount,
          total: totalHostCount,
        }}
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
  totalHostCount: propTypes.number,
};

export const PDFExportDownload = ({ id }) => (
  <BackgroundLink
    component={LinkButton}
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
