import React from 'react';
import { Button, Spinner } from '@patternfly/react-core';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  ComplianceModal,
  StateViewWithError,
  StateViewPart,
} from 'PresentationalComponents';
import { useLinkToBackground } from 'Utilities/Router';
import { GET_PROFILE } from './constants';
import ExportPDFForm from './ExportPDFForm/ExportPDFForm';
import usePDFExport from '@redhat-cloud-services/frontend-components-utilities/useExportPDF';
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

  const exportPDF = usePDFExport('compliance');

  const buttonLabel = 'Export report';
  const buttonProps = {
    ouiaId: 'ExportReportButton',
    variant: 'primary',
    isDisabled: !settingsValid,
  };

  const downloadReport = () => {
    const exportFileName = `compliance-report--${
      new Date().toISOString().split('T')[0]
    }`;
    exportPDF('report', exportFileName, exportSettings);
  };

  const actions = [
    <Button
      key="export"
      onClick={downloadReport}
      {...buttonProps}
      className="pf-u-mr-sm"
    >
      {buttonLabel}
    </Button>,
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
    <ComplianceModal
      isOpen
      width="440px"
      ouiaId="DownloadReportModal"
      title="Compliance report"
      onClose={() => linkToReport()}
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
    </ComplianceModal>
  );
};

export default ReportDownload;
