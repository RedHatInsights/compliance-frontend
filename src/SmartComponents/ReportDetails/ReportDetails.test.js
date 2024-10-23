import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestWrapper from '@/Utilities/TestWrapper';
import ReportDetails from './ReportDetails';
import useAPIV2FeatureFlag from 'Utilities/hooks/useAPIV2FeatureFlag';
import useReport from 'Utilities/hooks/api/useReport';
import { QUERY } from './constants';
import { buildReport, buildReportV2 } from '../../__factories__/report';

jest.mock('@/Utilities/hooks/api/useReport');
jest.mock('@/Utilities/hooks/useAPIV2FeatureFlag');
jest.mock('Utilities/hooks/useDocumentTitle', () => ({
  useTitleEntity: () => ({}),
  setTitle: () => ({}),
}));

const reportFromGraphQL = buildReport(1);
const reportFromREST = buildReportV2();
const mocks = [
  {
    request: {
      query: QUERY,
      variables: {
        policyId: '1234',
      },
    },
    result: {
      data: reportFromGraphQL,
    },
  },
];

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
    useParams: jest.fn().mockReturnValue({ report_id: '1234' }), // eslint-disable-line
}));

beforeEach(() => {
  useAPIV2FeatureFlag.mockImplementation(() => false);
});

describe('ReportDetails', () => {
  const defaultProps = {
    route: {
      defaultTitle: 'Title',
    },
  };

  it('expect to render a report properly', async () => {
    render(
      <TestWrapper mocks={mocks}>
        <ReportDetails {...defaultProps} />
      </TestWrapper>
    );

    expect(screen.getAllByText('Loading...')[0]).toBeInTheDocument();
    expect(
      await screen.findByRole('heading', {
        name: `Report: ${reportFromGraphQL.profile.policy.name}`,
      })
    ).toBeInTheDocument();
  });
});

describe('Report Details - REST', () => {
  beforeEach(() => {
    useAPIV2FeatureFlag.mockImplementation(() => true);
  });

  it('should use REST api', async () => {
    useReport.mockImplementation(() => ({
      data: {
        data: reportFromREST,
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
        name: `Report: ${reportFromREST.title}`,
      })
    ).toBeInTheDocument();
  });
});
