import React from 'react';
import propTypes from 'prop-types';
import { Content } from '@patternfly/react-core';
import { ExportIcon } from '@patternfly/react-icons';
import {
  GreySmallText,
  LinkWithPermission as Link,
  LinkButton,
} from 'PresentationalComponents';
import ReportChart from '../../SmartComponents/ReportDetails/Components/ReportChart';

export const Name = (report) => (
  <Content>
    <Link to={`/reports/${report.id}`} style={{ marginRight: '.5rem' }}>
      {report.title}
    </Link>
    <React.Fragment>
      <GreySmallText>{report.profile_title}</GreySmallText>
    </React.Fragment>
  </Content>
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

export const PDFExportDownload = ({ id }) => {
  const basePath = `/reports/${id}`;
  const downloadUrl = `${basePath}/pdf`;

  return (
    <Link
      aria-label="Reports PDF download link"
      to={downloadUrl}
      Component={LinkButton}
      componentProps={{
        className: 'pf-v5-u-mr-md',
        variant: 'plain',
        ouiaId: 'ReportsDownloadReportPDFLink',
      }}
    >
      <ExportIcon />
    </Link>
  );
};

PDFExportDownload.propTypes = {
  id: propTypes.string,
};
