import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import TestWrapper from 'Utilities/TestWrapper';
import { buildPolicies } from '@/__factories__/policies';
import usePolicy from 'Utilities/hooks/api/usePolicy';
import usePolicyOsVersionCounts from 'Utilities/hooks/usePolicyOsVersionCounts';
import useUpdateTailoring from 'Utilities/hooks/api/useUpdateTailoring';
import PolicyDetails from './PolicyDetails';

jest.mock('Utilities/hooks/useDocumentTitle');
jest.mock('Utilities/hooks/api/usePolicy');
jest.mock('Utilities/hooks/usePolicyOsVersionCounts');
jest.mock('Utilities/hooks/api/useUpdateTailoring');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ policy_id: 'some-policy-id' }),
}));
jest.mock('Utilities/hooks/useFeatureFlag', () => () => true);
jest.mock('Utilities/hooks/usePermissionCheck', () => ({
  useKesselPermissions: jest.fn(() => ({ hasAccess: true, isLoading: false })),
}));

describe('PolicyDetails', () => {
  const fixturePolicy = buildPolicies(1)[0];

  beforeAll(() => {
    useUpdateTailoring.mockReturnValue({ fetch: jest.fn() });
  });

  it('renders without error', () => {
    usePolicy.mockReturnValue({
      data: {
        data: fixturePolicy,
      },
      loading: false,
    });

    render(<PolicyDetails />, {
      wrapper: TestWrapper,
    });

    screen.getByRole('heading', {
      name: fixturePolicy.title,
    });
    screen.getByRole('tab', {
      name: /details/i,
    });
    screen.getByRole('tab', {
      name: /rules/i,
    });
    screen.getByRole('tab', {
      name: /systems/i,
    });
  });

  it('renders with error', () => {
    usePolicy.mockReturnValue({
      data: undefined,
      loading: false,
      error: 'Error',
    });
    render(
      <TestWrapper>
        <PolicyDetails />
      </TestWrapper>,
    );

    screen.getByRole('heading', {
      name: /something went wrong/i,
    });
  });

  it('calls for system counts', () => {
    usePolicy.mockReturnValue({
      data: {
        data: fixturePolicy,
      },
      loading: false,
    });
    render(
      <TestWrapper>
        <PolicyDetails />
      </TestWrapper>,
    );

    expect(usePolicyOsVersionCounts).toHaveBeenCalledWith('some-policy-id');
  });
});
