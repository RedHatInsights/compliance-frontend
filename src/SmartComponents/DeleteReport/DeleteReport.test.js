import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useParams } from 'react-router-dom';
import useNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';
import useDeleteReport from 'Utilities/hooks/api/useDeleteReport';
import DeleteReport from './DeleteReport';

jest.mock('Utilities/hooks/api/useDeleteReport');

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

jest.mock(
  '@redhat-cloud-services/frontend-components-notifications/hooks',
  () => ({
    useAddNotification: jest.fn(() => jest.fn()),
  }),
);

describe('DeleteReport', () => {
  const navigateMocked = jest.fn();
  useNavigate.mockImplementation(() => navigateMocked);
  const reportId = '12345';
  const deleteReportQuery = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useParams.mockReturnValue({ report_id: reportId });
    deleteReportQuery.mockResolvedValue(undefined);
    useDeleteReport.mockReturnValue({
      query: deleteReportQuery,
    });
  });

  test('renders DeleteReportRest', async () => {
    render(<DeleteReport />);

    fireEvent.click(screen.getByText('Delete report'));

    expect(useDeleteReport).toHaveBeenCalledWith({ skip: true });

    await waitFor(() => {
      expect(deleteReportQuery).toHaveBeenCalledWith({ reportId });
      expect(navigateMocked).toHaveBeenCalledWith('/reports');
    });
  });

  test('handles error during REST deletion', async () => {
    const error = new Error('Deletion failed');
    deleteReportQuery.mockRejectedValue(error);

    render(<DeleteReport />);

    fireEvent.click(screen.getByText('Delete report'));

    await waitFor(() => {
      expect(navigateMocked).toHaveBeenCalledWith(-1);
    });
  });
});
