import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestWrapper from '@/Utilities/TestWrapper';

import PolicyDetails from './PolicyDetails';

jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  // TODO replace with MockProvider mocks and data factories
  useQuery: () => ({
    data: {
      profile: {
        id: '1',
        refId: '121212',
        name: 'profile1',
        description: 'profile description',
        totalHostCount: '1',
        complianceThreshold: '1',
        compliantHostCount: '1',
        osMajorVersion: '7',
        hosts: [],
        policy: {
          name: 'parentpolicy',
          profiles: [
            {
              id: '1',
              refId: '121212',
              name: 'profile1',
              description: 'profile description',
              osMinorVersion: '9',
              businessObjective: {
                id: '1',
                title: 'BO 1',
              },
              benchmark: {
                title: 'benchmark',
                version: '0.1.5',
              },
            },
          ],
        },
        businessObjective: {
          id: '1',
          title: 'BO 1',
        },
        benchmark: {
          title: 'benchmark',
          version: '0.1.5',
        },
      },
    },
    error: undefined,
    loading: undefined,
    refetch: () => {},
  }),
}));

jest.mock('Utilities/hooks/useDocumentTitle', () => ({
  useTitleEntity: () => ({}),
  setTitle: () => ({}),
}));

jest.mock('../../Utilities/hooks/useAPIV2FeatureFlag', () => ({
  __esModule: true,
  default: () => false,
}));

describe('PolicyDetails', () => {
  it('expect to render without error', () => {
    render(
      <TestWrapper>
        <PolicyDetails />
      </TestWrapper>
    );

    expect(
      screen.getByRole('heading', { name: 'profile1' })
    ).toBeInTheDocument();
  });
});
