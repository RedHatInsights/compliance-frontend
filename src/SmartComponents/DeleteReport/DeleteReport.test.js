import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useParams } from 'react-router-dom';
import useNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';
import { apiInstance } from 'Utilities/hooks/useQuery';
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
  });

  test('renders DeleteReportRest', async () => {
    apiInstance.deleteReport.mockResolvedValue({});

    render(<DeleteReport />);

    fireEvent.click(screen.getByText('Delete report'));

    expect(apiInstance.deleteReport).toHaveBeenCalledWith(reportId);

    await waitFor(() => {
      expect(navigateMocked).toHaveBeenCalledWith('/reports');
    });
  });

  test('handles error during REST deletion', async () => {
    const error = new Error('Deletion failed');
    apiInstance.deleteReport.mockRejectedValue(error);

    render(<DeleteReport />);

    fireEvent.click(screen.getByText('Delete report'));

    await waitFor(() => {
      expect(navigateMocked).toHaveBeenCalledWith(-1);
    });
  });
});
