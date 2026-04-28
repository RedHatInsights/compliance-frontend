import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

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

const mockRequestPdf = jest.fn();
jest.mock('Utilities/EnvironmentProvider', () => ({
  __esModule: true,
  ...jest.requireActual('Utilities/EnvironmentProvider'),
  useEnvironment: () => ({
    runtime: 'hcc',
    isIop: false,
    isHcc: true,
    hasChrome: true,
    authorizationProvider: 'rbac',
    isKesselEnabled: false,
    updateDocumentTitle: jest.fn(),
    hideGlobalFilter: jest.fn(),
    requestPdf: mockRequestPdf,
    logout: jest.fn(),
  }),
}));
jest.mock('Utilities/hooks/useFeatureFlag', () => () => true);

describe('ExportPDF', () => {
  it('renders the Compliance report modal title', () => {
    render(<ExportPDF />);

    expect(screen.getByText('Compliance report'));
    expect(screen.getByText('Test report title'));
    expect(screen.getByText('Export to PDF'));
    expect(screen.getByText('Cancel'));
  });
});
