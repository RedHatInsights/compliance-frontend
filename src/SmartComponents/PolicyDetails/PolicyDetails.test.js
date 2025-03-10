import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestWrapper from '@/Utilities/TestWrapper';
import PolicyDetails from '@/SmartComponents/PolicyDetails/PolicyDetails';
import usePolicy from '../../Utilities/hooks/api/usePolicy';
import { buildPolicies } from '../../__factories__/policies';
import usePolicyOsVersionCounts from '../../Utilities/hooks/api/usePolicyOsVersionCounts';

jest.mock('../../Utilities/hooks/useDocumentTitle');
jest.mock('../../PresentationalComponents/Tailorings/Tailorings');
jest.mock('../../Utilities/hooks/api/usePolicy');
jest.mock('./PolicySystemsTab');
jest.mock(
  '../../PresentationalComponents/PolicyDetailsDescription/PolicyDetailsDescription'
);
jest.mock('../../Utilities/hooks/api/usePolicyOsVersionCounts');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ policy_id: 'some-policy-id' }),
}));

describe('PolicyDetails', () => {
  const fixturePolicy = buildPolicies(1)[0];

  it('renders without error', () => {
    usePolicy.mockReturnValue({
      data: {
        data: fixturePolicy,
      },
      loading: false,
    });
    render(
      <TestWrapper>
        <PolicyDetails />
      </TestWrapper>
    );

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
      </TestWrapper>
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
      </TestWrapper>
    );

    expect(usePolicyOsVersionCounts).toBeCalledWith('some-policy-id');
  });
});
