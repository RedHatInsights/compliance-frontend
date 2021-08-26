import React, { useState } from 'react';
import { Button, Modal, Spinner } from '@patternfly/react-core';
import { useParams } from 'react-router-dom';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import { StateViewWithError, StateViewPart } from 'PresentationalComponents';
import { useLinkToBackground } from 'Utilities/Router';
import ExportPDFForm from './Components/ExportPDFForm';
import usePDFExport from './hooks/usePDFExport';
//eslint-disable-next-line
import { DownloadButton } from '@redhat-cloud-services/frontend-components-pdf-generator';

export const QUERY = gql`
  query Profile($policyId: String!) {
    profile(id: $policyId) {
      id
      name
      refId
      testResultHostCount
      compliantHostCount
      unsupportedHostCount
      complianceThreshold
      majorOsVersion
      lastScanned
      policyType
      policy {
        id
        name
      }
      benchmark {
        id
        version
      }
      businessObjective {
        id
        title
      }
    }
  }
`;

export const ReportDownload = () => {
  const { report_id: policyId } = useParams();
  const linkToReport = useLinkToBackground('/reports/' + policyId);
  const { data, loading, error } = useQuery(QUERY, {
    variables: { policyId },
  });
  const policy = data?.profile;
  const [exportSettings, setExportSettings] = useState({
    compliantSystems: false,
    nonCompliantSystems: true,
    unsupportedSystems: true,
    topTenFailedRules: true,
    userNotes: undefined,
  });
  const setExportSetting = (setting) => {
    return (value) => {
      setExportSettings({
        ...exportSettings,
        [setting]: value,
      });
    };
  };
  const exportPDF = policy
    ? usePDFExport(exportSettings, policy)
    : () => Promise.resolve([]);

  const actions = [
    <DownloadButton
      groupName="Red Hat Insights"
      key="export"
      label="Export report"
      fileName={`Report.pdf`}
      asyncFunction={() => {
        console.log(exportPDF());
        return Promise.resolve([]);
      }}
      buttonProps={{
        ouiaId: 'ExportReportButton',
        variant: 'primary',
      }}
    />,
    <Button
      variant="secondary"
      key="cancel"
      ouiaId="ExportReportCancelButton"
      onClick={linkToReport}
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
