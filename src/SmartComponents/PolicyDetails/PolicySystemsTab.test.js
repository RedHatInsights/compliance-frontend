import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestWrapper from '@/Utilities/TestWrapper';

import PolicySystemsTab from './PolicySystemsTab';
import { policies } from '@/__fixtures__/policies';

describe('PolicySystemsTab', () => {
  it('expect to render with systems table', () => {
    const policy = {
      ...policies.edges[0].node,
      hosts: [],
    };
    render(
      <TestWrapper>
        <PolicySystemsTab {...{ policy }} />
      </TestWrapper>,
    );

    expect(screen.getByLabelText('Inventory Table')).toBeInTheDocument();
  });
});
