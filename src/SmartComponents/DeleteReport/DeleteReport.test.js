import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import useNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';
import useAPIV2FeatureFlag from '../../Utilities/hooks/useAPIV2FeatureFlag';
import { apiInstance } from '../../Utilities/hooks/useQuery';
import DeleteReportWrapper from './DeleteReport';

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));

jest.mock('@apollo/client', () => {
  const actualApolloClient = jest.requireActual('@apollo/client');
  return {
    ...actualApolloClient,
    useMutation: jest.fn(),
    gql: jest.fn().mockImplementation((query) => query),
  };
});

jest.mock(
  '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate',
  () => ({
    __esModule: true,
    default: jest.fn(),
  })
);

jest.mock('../../Utilities/hooks/useAPIV2FeatureFlag');
jest.mock('../../Utilities/hooks/useQuery');
jest.mock(
  '@redhat-cloud-services/frontend-components-notifications/redux',
  () => ({
    addNotification: jest.fn(),
  })
);

jest.mock('Utilities/Dispatcher', () => ({
  dispatchAction: jest.fn(),
}));

describe('DeleteReportWrapper', () => {
  const navigateMocked = jest.fn();
  useNavigate.mockImplementation(() => navigateMocked);
  const reportId = '12345';

  beforeEach(() => {
    jest.clearAllMocks();
    useParams.mockReturnValue({ report_id: reportId });
  });

  test('renders spinner when apiV2Enabled is undefined', () => {
    useAPIV2FeatureFlag.mockReturnValue(undefined);

    render(<DeleteReportWrapper />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders DeleteReportRest when apiV2Enabled is true', async () => {
    useAPIV2FeatureFlag.mockReturnValue(true);
    apiInstance.deleteReport.mockResolvedValue({});

    render(<DeleteReportWrapper />);

    fireEvent.click(screen.getByText('Delete report'));

    expect(apiInstance.deleteReport).toHaveBeenCalledWith(reportId);

    await waitFor(() => {
      expect(navigateMocked).toHaveBeenCalledWith('/reports');
    });
  });

  test('renders DeleteReportGraphQL when apiV2Enabled is false', async () => {
    const mockMutation = jest.fn(() => Promise.resolve());
    useAPIV2FeatureFlag.mockReturnValue(false);
    useMutation.mockReturnValue([
      mockMutation,
      { loading: false, error: null },
    ]);

    render(<DeleteReportWrapper />);

    fireEvent.click(screen.getByText('Delete report'));

    await waitFor(() => {
      expect(mockMutation).toHaveBeenCalledWith({
        variables: { input: { profileId: reportId } },
      });
    });
  });

  test('handles error during REST deletion', async () => {
    useAPIV2FeatureFlag.mockReturnValue(true);
    const error = new Error('Deletion failed');
    apiInstance.deleteReport.mockRejectedValue(error);

    render(<DeleteReportWrapper />);

    fireEvent.click(screen.getByText('Delete report'));

    await waitFor(() => {
      expect(navigateMocked).toHaveBeenCalledWith(-1);
    });
  });
});
