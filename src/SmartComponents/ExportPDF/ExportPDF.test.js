import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { ReportDownload } from './ExportPDF';

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(() => ({ report_id: 'test-report-id' })),
}));
jest.mock(
  '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate',
  () => jest.fn(() => jest.fn()),
);
jest.mock('SmartComponents/ReportDownload/hooks/useExportSettings', () =>
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

jest.mock('Utilities/Dispatcher', () => ({
  dispatchNotification: jest.fn(),
}));

describe('ReportDownload', () => {
  it('renders the Compliance report modal title', () => {
    render(<ReportDownload />);

    expect(screen.getByText('Compliance report'));
    expect(screen.getByText('Test report title'));
    expect(screen.getByText('Export to PDF'));
    expect(screen.getByText('Cancel'));
  });
});
