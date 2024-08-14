import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestWrapper from '@/Utilities/TestWrapper';
import ReportsDetail from './ReportDetails';
import useAPIV2FeatureFlag from '@/Utilities/hooks/useAPIV2FeatureFlag.js';
import { useReport } from '@/Utilities/hooks/api/useReport';
import { QUERY } from './constants';

jest.mock('@/Utilities/hooks/api/useReport');
jest.mock('@/Utilities/hooks/useAPIV2FeatureFlag');
jest.mock('Utilities/hooks/useDocumentTitle', () => ({
  useTitleEntity: () => ({}),
  setTitle: () => ({}),
}));

const mocks = [
  {
    request: {
      query: QUERY,
      variables: {
        policyId: '1234',
      },
    },
    result: {
      data: {
        profile: {
          id: '1234',
          name: 'profile1',
          refId: '121212',
          totalHostCount: 10,
          testResultHostCount: 10,
          compliantHostCount: 5,
          unsupportedHostCount: 5,
          complianceThreshold: 1,
          osMajorVersion: '7',
          lastScanned: Date.now(),
          policyType: 'policy type',
          policy: {
            id: 'thepolicyid',
            name: 'the policy name',
            profiles: [
              {
                benchmark: { version: 1 },
              },
              {
                benchmark: { version: 2 },
              },
            ],
          },
          businessObjective: {
            id: '1',
            title: 'BO 1',
          },
        },
      },
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
        <ReportsDetail {...defaultProps} />
      </TestWrapper>
    );

    expect(screen.getAllByText('Loading...')[0]).toBeInTheDocument();
    expect(
      await screen.findByRole('heading', { name: 'Report: the policy name' })
    ).toBeInTheDocument();
  });
});

describe('Reports - REST', () => {
  beforeEach(() => {
    useAPIV2FeatureFlag.mockImplementation(() => true);
  });

  it('should use REST api', () => {
    useReport.mockImplementation(() => ({
      data: [],
      loading: false,
      error: null,
      refetch: () => {},
    }));

    render(
      <TestWrapper>
        <ReportsDetail />
      </TestWrapper>
    );

    expect(useReport).toHaveBeenCalledWith('1234');
  });
});
