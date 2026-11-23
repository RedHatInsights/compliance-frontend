import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import useReport from 'Utilities/hooks/api/useReport';
import useExportSettings from './hooks/useExportSettings';
import { ExportPDF } from './ExportPDF';

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(() => ({ report_id: 'test-report-id' })),
}));
jest.mock(
  '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate',
  () => jest.fn(() => jest.fn()),
);
jest.mock('./hooks/useExportSettings', () =>
  jest.fn(() => ({
    exportSettings: {},
    setExportSetting: jest.fn(),
    isValid: true,
  })),
);

jest.mock('Utilities/hooks/api/useReport', () =>
  jest.fn(() => ({
    data: { data: { title: 'Test report title' } },
    loading: false,
    error: undefined,
  })),
);

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () =>
  jest.fn(() => ({
    requestPdf: jest.fn(),
  })),
);

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () =>
  jest.fn(() => ({
    requestPdf: jest.fn(),
  })),
);
jest.mock('Utilities/hooks/unleash/useFeatureFlag', () => () => true);

describe('ExportPDF', () => {
  it('renders the Compliance report modal title', () => {
    render(<ExportPDF />);

    expect(screen.getByText('Compliance report'));
    expect(screen.getByText('Test report title'));
    expect(screen.getByText('Export to PDF'));
    expect(screen.getByText('Cancel'));
  });

  describe('PDF request', () => {
    const exportSettings = { nonCompliantSystems: true, userNotes: '' };
    const requestWith = async (nonCompliantCount) => {
      const requestPdf = jest.fn().mockResolvedValue(undefined);
      useChrome.mockReturnValue({ requestPdf });
      useExportSettings.mockReturnValue({
        exportSettings,
        setExportSetting: jest.fn(),
        isValid: true,
      });
      useReport.mockReturnValue({
        data: {
          data: {
            title: 'Test report title',
            assigned_system_count: nonCompliantCount,
            reported_system_count: nonCompliantCount,
            compliant_system_count: 0,
            unsupported_system_count: 0,
          },
        },
        loading: false,
        error: undefined,
      });
      render(<ExportPDF />);

      await userEvent.click(screen.getByText('Export to PDF'));
      await waitFor(() => expect(requestPdf).toHaveBeenCalledTimes(1));
      return requestPdf.mock.calls[0][0].payload;
    };

    it('sends a small report as one payload, as before', async () => {
      expect(await requestWith(2000)).toEqual({
        manifestLocation: '/apps/compliance/fed-mods.json',
        scope: 'compliance',
        module: './ReportPDFBuild',
        fetchDataParams: { reportId: 'test-report-id', exportSettings },
      });
    });

    it('sends a large report as one payload per slice', async () => {
      const payload = await requestWith(2500);

      expect(payload).toHaveLength(3);
      expect(
        payload.map(({ fetchDataParams }) => fetchDataParams.slice),
      ).toEqual([
        expect.objectContaining({ first: true, last: false }),
        expect.objectContaining({ first: false, last: false }),
        expect.objectContaining({ first: false, last: true }),
      ]);
      expect(payload[1].fetchDataParams).toMatchObject({
        reportId: 'test-report-id',
        exportSettings,
        slice: { ranges: { nonCompliantSystems: { offset: 834, limit: 834 } } },
      });
    });
  });
});
