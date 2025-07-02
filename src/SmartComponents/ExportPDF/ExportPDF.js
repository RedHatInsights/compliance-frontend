import React, { useState } from 'react';
import { Button, Spinner } from '@patternfly/react-core';
import { useParams } from 'react-router-dom';

import {
  ComplianceModal,
  StateViewWithError,
  StateViewPart,
} from 'PresentationalComponents';
import useNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';
import ExportPDFForm from 'SmartComponents/ReportDownload/Components/ExportPDFForm';
import useExportSettings from 'SmartComponents/ReportDownload/hooks/useExportSettings';
import useReport from 'Utilities/hooks/api/useReport';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { dispatchNotification } from 'Utilities/Dispatcher';
import { exportNotifications } from './constants';

export const ReportDownload = () => {
  const { report_id: reportId } = useParams();
  const [loadingPDF, setLoadingPDF] = useState(false);
  const {
    data: { data: reportData } = {},
    loading,
    error,
  } = useReport({ params: { reportId } });

  const navigate = useNavigate();
  const {
    exportSettings,
    setExportSetting,
    isValid: settingsValid,
  } = useExportSettings();

  const { requestPdf } = useChrome();

  const dataFetch = async () => {
    setLoadingPDF(true);
    dispatchNotification(exportNotifications.pending);

    try {
      await requestPdf({
        filename: `compliance-report--${new Date()
          .toUTCString()
          .replace(/ /g, '-')}.pdf`,
        payload: {
          manifestLocation: '/apps/compliance/fed-mods.json',
          scope: 'compliance',
          module: './ReportPDFBuild',
          fetchDataParams: {
            reportId: reportId,
            exportSettings: exportSettings,
          },
        },
      });

      dispatchNotification(exportNotifications.success);
    } catch (error) {
      console.log(error);
      dispatchNotification(exportNotifications.error);
    } finally {
      setLoadingPDF(false);
    }
  };

  const actions = [
    <Button
      onClick={dataFetch}
      variant="primary"
      key="export"
      isDisabled={loadingPDF || !settingsValid}
      ouiaId="ExportPDFButton"
      isLoading={loadingPDF}
    >
      Export to PDF
    </Button>,
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
      <StateViewWithError stateValues={{ error, data: reportData, loading }}>
        <StateViewPart stateKey="loading">
          <Spinner />
        </StateViewPart>
        <StateViewPart stateKey="data">
          <ExportPDFForm
            {...{
              report: reportData,
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
