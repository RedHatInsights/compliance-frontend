import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestWrapper from '@/Utilities/TestWrapper';

import NoPoliciesState from './NoPoliciesState';

describe('NoPoliciesState', () => {
  it('renders a note with a system having no policies', () => {
    render(
      <TestWrapper>
        <NoPoliciesState />
      </TestWrapper>
    );

    expect(
      screen.getByText(
        'This system is not part of any SCAP policies defined within Compliance.'
      )
    ).toBeInTheDocument();
  });
});
