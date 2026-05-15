import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useParams } from 'react-router-dom';
import useNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';
import { getComplianceApiInstance } from 'Utilities/hooks/useQuery';
import DeleteReport from './DeleteReport';

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));

jest.mock(
  '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate',
  () => ({
    __esModule: true,
    default: jest.fn(),
  }),
);
jest.mock('Utilities/hooks/useQuery');

describe('DeleteReport', () => {
  const navigateMocked = jest.fn();
  useNavigate.mockImplementation(() => navigateMocked);
  const reportId = '12345';

  beforeEach(() => {
    jest.clearAllMocks();
    useParams.mockReturnValue({ report_id: reportId });
    getComplianceApiInstance.mockReturnValue({
      deleteReport: jest.fn(),
    });
  });

  test('renders DeleteReportRest', async () => {
    const deleteReport = jest.fn().mockResolvedValue({});
    getComplianceApiInstance.mockReturnValue({ deleteReport });

    render(<DeleteReport />);

    fireEvent.click(screen.getByText('Delete report'));

    expect(deleteReport).toHaveBeenCalledWith(reportId);

    await waitFor(() => {
      expect(navigateMocked).toHaveBeenCalledWith('/reports');
    });
  });

  test('handles error during REST deletion', async () => {
    const error = new Error('Deletion failed');
    const deleteReport = jest.fn().mockRejectedValue(error);
    getComplianceApiInstance.mockReturnValue({ deleteReport });

    render(<DeleteReport />);

    fireEvent.click(screen.getByText('Delete report'));

    await waitFor(() => {
      expect(navigateMocked).toHaveBeenCalledWith(-1);
    });
  });
});
