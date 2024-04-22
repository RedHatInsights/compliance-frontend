import React from 'react';
import propTypes from 'prop-types';
import { TextContent, Text } from '@patternfly/react-core';
import { DownloadIcon } from '@patternfly/react-icons';
import {
  PolicyPopover,
  GreySmallText,
  UnsupportedSSGVersion,
  LinkWithPermission as Link,
  LinkButton,
} from 'PresentationalComponents';
import ReportChart from '../../SmartComponents/ReportDetails/Components/ReportChart';

export const Name = (profile) => (
  <TextContent>
    <Link to={`/reports/${profile.id}`} style={{ marginRight: '.5rem' }}>
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
  benchmark,
  policy,
}) => {
  const { version: ssgVersion } = benchmark || {};
  const supported = unsupportedHostCount === 0;
  const ssgVersionLabel = 'SSG: ' + ssgVersion;

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

export const CompliantSystems = (profile) => {
  return (
    <React.Fragment>
      <ReportChart
        profile={profile}
        hasLegend={false}
        chartClass="report-table-chart-container"
      />
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
  <Link
    aria-label="Reports PDF download link"
    to={`/reports/${id}/pdf`}
    Component={LinkButton}
    componentProps={{
      className: 'pf-v5-u-mr-md',
      variant: 'plain',
      ouiaId: 'ReportsDownloadReportPDFLink',
    }}
  >
    <DownloadIcon />
  </Link>
);

PDFExportDownload.propTypes = {
  id: propTypes.string,
};
