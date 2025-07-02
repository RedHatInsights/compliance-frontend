import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { ReportDownload } from './ExportPDF';

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(() => ({ report_id: 'test-report-id' })),
}));

// jest.mock('PresentationalComponents', () => ({
//   ComplianceModal: jest.fn(({ children, actions, onClose, title, ...props }) => (
//     <div data-testid="mock-compliance-modal" {...props}>
//       <h2 data-testid="modal-title">{title}</h2>
//       <button onClick={onClose} data-testid="modal-close-button">Close</button>
//       {children}
//       <div data-testid="mock-modal-actions">{actions}</div>
//     </div>
//   )),
//   StateViewWithError: jest.fn(({ children, stateValues }) => {
//     // This mock simplifies the StateViewWithError to directly render based on state
//     if (stateValues.loading) {
//       return <div data-testid="mock-state-view-loading">Loading content</div>;
//     }
//     if (stateValues.error) {
//       return <div data-testid="mock-state-view-error">Error content</div>;
//     }
//     return <div data-testid="mock-state-view-data">{children}</div>;
//   }),
//   StateViewPart: jest.fn(({ children, stateKey }) => (
//     <div data-testid={`mock-state-view-part-${stateKey}`}>{children}</div>
//   )),
// }));

jest.mock(
  '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate',
  () => jest.fn(() => jest.fn()),
);

// jest.mock('SmartComponents/ReportDownload/Components/ExportPDFForm', () => jest.fn(() => (
//   <div data-testid="mock-export-pdf-form">Mock Export PDF Form</div>
// )));

jest.mock('SmartComponents/ReportDownload/hooks/useExportSettings', () =>
  jest.fn(() => ({
    exportSettings: {},
    setExportSetting: jest.fn(),
    isValid: true,
  })),
);

jest.mock('Utilities/hooks/api/useReport', () =>
  jest.fn(() => ({
    data: { data: { title: 'Test Report Title' } },
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
    expect(screen.getByText('System data to include'));
    expect(screen.getByText('Export to PDF'));
    expect(screen.getByText('Cancel'));
  });
});
