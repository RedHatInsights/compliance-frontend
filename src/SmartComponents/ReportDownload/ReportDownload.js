import React, { useMemo } from 'react';
import { Button, Spinner } from '@patternfly/react-core';
import { useParams } from 'react-router-dom';
// eslint-disable-next-line
import { DownloadButton } from '@redhat-cloud-services/frontend-components-pdf-generator/dist/esm/index';
import {
  ComplianceModal,
  StateViewWithError,
  StateViewPart,
} from 'PresentationalComponents';
import useNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';
import ExportPDFForm from './Components/ExportPDFForm';
import usePDFExport from './hooks/usePDFExport';
import useExportSettings from './hooks/useExportSettings';
import useReport from 'Utilities/hooks/api/useReport';
import dataSerialiser from 'Utilities/dataSerialiser';
import { reportDataMap } from '@/constants';

// Provides that export settings modal accessible in the report details
export const ReportDownload = () => {
  const { report_id: reportId } = useParams();

  const { data: { data } = {}, loading, error } = useReport(reportId);
  const reportSerialisedData = useMemo(
    () => dataSerialiser(data, reportDataMap),
    [data]
  );

  const navigate = useNavigate();
  const {
    exportSettings,
    setExportSetting,
    isValid: settingsValid,
  } = useExportSettings();

  const exportPDF = usePDFExport(exportSettings, reportSerialisedData);
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
      type={reportSerialisedData && reportSerialisedData.name}
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
            {...{
              policy: reportSerialisedData,
              setExportSetting,
              exportSettings,
            }}
          />
        </StateViewPart>
      </StateViewWithError>
    </ComplianceModal>
  );
};

export default ReportDownload;
