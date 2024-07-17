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
      {profile?.title}
    </Link>
    <React.Fragment>
      <PolicyPopover {...{ profile, position: 'right' }} />
      <GreySmallText>{profile.profile_title}</GreySmallText>
    </React.Fragment>
  </TextContent>
);

Name.propTypes = {
  profile: propTypes.object,
};

export const OperatingSystem = ({
  os_major_version,
  unsupported_system_count,
  benchmark,
  policy,
}) => {
  const { version: ssgVersion } = benchmark || {};
  const supported = unsupported_system_count === 0;
  const ssgVersionLabel = 'SSG: ' + ssgVersion;

  return (
    <React.Fragment>
      RHEL {os_major_version}
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
  os_major_version: propTypes.string,
  benchmark: propTypes.object,
  unsupported_system_count: propTypes.number,
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
  reported_system_count: propTypes.number,
  compliant_system_count: propTypes.number,
  unsupported_system_count: propTypes.number,
  assigned_system_count: propTypes.number,
};

//TODO: use id from REST API after ReportDownload page is migrated
export const PDFExportDownload = ({ oldId }) => (
  <Link
    aria-label="Reports PDF download link"
    to={`/reports/${oldId}/pdf`}
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
  //  id: propTypes.string,
  oldId: propTypes.string,
};
