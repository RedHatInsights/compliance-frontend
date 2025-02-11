import React from 'react';
import propTypes from 'prop-types';
import { TextContent } from '@patternfly/react-core';
import { DownloadIcon } from '@patternfly/react-icons';
import {
  PolicyPopover,
  GreySmallText,
  LinkWithPermission as Link,
  LinkButton,
} from 'PresentationalComponents';
import ReportChart from '../../SmartComponents/ReportDetails/Components/ReportChart';

export const Name = (report) => (
  <TextContent>
    <Link to={`/reports/${report.id}`} style={{ marginRight: '.5rem' }}>
      {report.title}
    </Link>
    <React.Fragment>
      <PolicyPopover {...{ report, position: 'right' }} />
      <GreySmallText>{report.profile_title}</GreySmallText>
    </React.Fragment>
  </TextContent>
);

Name.propTypes = {
  report: propTypes.object,
};

export const OperatingSystem = ({ os_major_version }) => {
  return <React.Fragment>RHEL {os_major_version}</React.Fragment>;
};

OperatingSystem.propTypes = {
  os_major_version: propTypes.number,
};

export const CompliantSystems = (report) => {
  return (
    <React.Fragment>
      <ReportChart
        report={report}
        hasLegend={false}
        chartClass="report-table-chart-container"
      />
    </React.Fragment>
  );
};

CompliantSystems.propTypes = {
  report: propTypes.object,
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
