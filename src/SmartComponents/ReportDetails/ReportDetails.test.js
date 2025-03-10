import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestWrapper from '@/Utilities/TestWrapper';
import ReportDetails from './ReportDetails';
import useReport from 'Utilities/hooks/api/useReport';
import { buildReport } from '../../__factories__/report';

jest.mock('@/Utilities/hooks/api/useReport');
jest.mock('Utilities/hooks/useDocumentTitle', () => ({
  useTitleEntity: () => ({}),
  setTitle: () => ({}),
}));

const reportsData = buildReport();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
    useParams: jest.fn().mockReturnValue({ report_id: '1234' }), // eslint-disable-line
}));

describe('ReportDetails', () => {
  it('renders without error ', async () => {
    useReport.mockImplementation(() => ({
      data: {
        data: reportsData,
      },
      loading: false,
      error: null,
      refetch: () => {},
    }));

    render(
      <TestWrapper>
        <ReportDetails />
      </TestWrapper>
    );

    expect(useReport).toHaveBeenCalledWith('1234');

    expect(
      await screen.findByRole('heading', {
        name: `Report: ${reportsData.title}`,
      })
    ).toBeInTheDocument();
  });
});
