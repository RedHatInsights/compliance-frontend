import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestWrapper from '@/Utilities/TestWrapper';

import PolicyDetails from './PolicyDetails';

jest.mock('Utilities/hooks/useDocumentTitle', () => ({
  useTitleEntity: () => ({}),
  setTitle: () => ({}),
}));

describe('PolicyDetails', () => {
  it('expect to render without error', () => {
    render(
      <TestWrapper>
        <PolicyDetails />
      </TestWrapper>
    );

    /* expect(
      screen.getByRole('heading', { name: 'profile1' })
    ).toBeInTheDocument(); */

    // TODO: add tests
  });
});
