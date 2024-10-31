import React, { useMemo } from 'react';
import propTypes from 'prop-types';
import { Button, Spinner } from '@patternfly/react-core';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
// eslint-disable-next-line
import { DownloadButton } from '@redhat-cloud-services/frontend-components-pdf-generator/dist/esm/index';
import {
  ComplianceModal,
  StateViewWithError,
  StateViewPart,
} from 'PresentationalComponents';
import useNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';
import { GET_PROFILE } from './constants';
import ExportPDFForm from './Components/ExportPDFForm';
import usePDFExport from './hooks/usePDFExport';
import useExportSettings from './hooks/useExportSettings';
import useReport from 'Utilities/hooks/api/useReport';
import dataSerialiser from 'Utilities/dataSerialiser';
import { reportDataMap } from '@/constants';
import GatedComponents from '@/PresentationalComponents/GatedComponents';

// Provides that export settings modal accessible in the report details
export const ReportDownloadBase = ({ report, loading, error, data }) => {
  const navigate = useNavigate();
  const {
    exportSettings,
    setExportSetting,
    isValid: settingsValid,
  } = useExportSettings();

  const exportPDF = usePDFExport(exportSettings, report);
  const exportFileName = `compliance-report--${
    new Date().toISOString().split('T')[0]
  }`;
  const buttonLabel = 'Export report';
  const buttonProps = {
    ouiaId: 'ExportReportButton',
    variant: 'primary',
    isDisabled: !settingsValid,
  };

  const FallbackButton = () => <Button {...buttonProps}>{buttonLabel}</Button>;

  const actions = [
    <DownloadButton
      groupName="Red Hat Insights"
      key="export"
      label={buttonLabel}
      reportName={`Compliance:`}
      type={report && report.name}
      fileName={exportFileName}
      asyncFunction={exportPDF}
      buttonProps={buttonProps}
      fallback={<FallbackButton />}
      className="pf-v5-u-mr-sm"
      onSuccess={() => navigate(-1)}
    />,
    <Button
      variant="secondary"
      key="cancel"
      ouiaId="ExportReportCancelButton"
      onClick={() => {
        navigate(-1);
      }}
    >
      Cancel
    </Button>,
  ];

  return (
    <ComplianceModal
      isOpen
      width="440px"
      ouiaId="DownloadReportModal"
      title="Compliance report"
      onClose={() => navigate(-1)}
      actions={actions}
    >
      <StateViewWithError stateValues={{ error, data, loading }}>
        <StateViewPart stateKey="loading">
          <Spinner />
        </StateViewPart>
        <StateViewPart stateKey="data">
          <ExportPDFForm
            {...{ policy: report, setExportSetting, exportSettings }}
          />
        </StateViewPart>
      </StateViewWithError>
    </ComplianceModal>
  );
};

ReportDownloadBase.propTypes = {
  report: propTypes.object.isRequired,
  loading: propTypes.bool,
  error: propTypes.object,
  data: propTypes.object.isRequired,
};

export const ReportDownloadGraphQL = () => {
  const { report_id: reportId } = useParams();

  const { data, loading, error } = useQuery(GET_PROFILE, {
    variables: { policyId: reportId },
  });

  return (
    <ReportDownloadBase report={data?.profile} {...{ loading, error, data }} />
  );
};

export const ReportDownloadRest = () => {
  const { report_id: reportId } = useParams();

  const { data: { data } = {}, loading, error } = useReport(reportId);
  const serialisedData = useMemo(
    () => dataSerialiser(data, reportDataMap),
    [data]
  );

  return (
    <ReportDownloadBase
      report={serialisedData}
      reportId={reportId}
      {...{ loading, error, data: serialisedData }}
    />
  );
};

export const ReportDownload = () => (
  <GatedComponents
    RestComponent={ReportDownloadRest}
    GraphQLComponent={ReportDownloadGraphQL}
  />
);

export default ReportDownload;
