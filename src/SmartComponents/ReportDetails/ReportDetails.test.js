import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestWrapper from '@/Utilities/TestWrapper';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY, ReportDetails } from './ReportDetails';

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
          id: '1',
          refId: '121212',
          name: 'profile1',
          policyType: 'policy type',
          description: 'profile description',
          external: false,
          testResultHostCount: 10,
          complianceThreshold: 1,
          compliantHostCount: 5,
          unsupportedHostCount: 5,
          osMajorVersion: '7',
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
          benchmark: {
            version: '0.1.4',
          },
        },
      },
    },
  },
];

jest.mock('@apollo/client');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
    useParams: jest.fn().mockReturnValue({ policy_id: '1' }), // eslint-disable-line
}));

describe('ReportDetails', () => {
  const defaultProps = {
    match: {
      params: {
        policyId: '123',
      },
    },
  };

  beforeEach(() => {
    useMutation.mockImplementation(() => [() => {}]);
    useQuery.mockImplementation(() => ({ data: mocks[0].result.data }));
    window.insights = {
      chrome: { isBeta: jest.fn(() => true) },
    };
  });

  it('expect to render a report properly', () => {
    render(
      <TestWrapper mocks={mocks}>
        <ReportDetails {...defaultProps} />
      </TestWrapper>
    );

    expect(
      screen.getByRole('heading', { name: 'Report: the policy name' })
    ).toBeInTheDocument();
  });
});
