import React from 'react';
import { Button, Modal, Spinner } from '@patternfly/react-core';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
// eslint-disable-next-line
import { DownloadButton } from '@redhat-cloud-services/frontend-components-pdf-generator';
import { StateViewWithError, StateViewPart } from 'PresentationalComponents';
import { useLinkToBackground } from 'Utilities/Router';
import { GET_PROFILE } from './constants';
import ExportPDFForm from './Components/ExportPDFForm';
import usePDFExport from './hooks/usePDFExport';
import useExportSettings from './hooks/useExportSettings';

// Provides that export settings modal accessible in the report details
export const ReportDownload = () => {
  const { report_id: policyId } = useParams();
  const linkToReport = useLinkToBackground('/reports/' + policyId);
  const { data, loading, error } = useQuery(GET_PROFILE, {
    variables: { policyId },
  });
  const policy = data?.profile;
  const {
    exportSettings,
    setExportSetting,
    isValid: settingsValid,
  } = useExportSettings();

  const exportPDF = usePDFExport(exportSettings, policy);
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
      type={policy && policy.name}
      fileName={exportFileName}
      asyncFunction={exportPDF}
      buttonProps={buttonProps}
      fallback={<FallbackButton />}
      className="pf-u-mr-sm"
    />,
    <Button
      variant="secondary"
      key="cancel"
      ouiaId="ExportReportCancelButton"
      onClick={(event) => {
        event.preventDefault();
        window.history.back();
      }}
    >
      Cancel
    </Button>,
  ];

  return (
    <Modal
      isOpen
      width="440px"
      ouiaId="DownloadReportModal"
      title="Compliance report"
      onClose={linkToReport}
      actions={actions}
    >
      <StateViewWithError stateValues={{ error, data, loading }}>
        <StateViewPart stateKey="loading">
          <Spinner />
        </StateViewPart>
        <StateViewPart stateKey="data">
          <ExportPDFForm {...{ policy, setExportSetting, exportSettings }} />
        </StateViewPart>
      </StateViewWithError>
    </Modal>
  );
};

export default ReportDownload;
