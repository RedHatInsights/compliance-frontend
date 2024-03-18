import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { policies } from '@/__fixtures__/policies';
import TestWrapper from '@/Utilities/TestWrapper';

import PolicyMultiversionRules from './PolicyMultiversionRules';

describe('PolicyMultiversionRules', () => {
  it('expect to render without error', () => {
    const hosts = [
      { osMinorVersion: '9' },
      { osMinorVersion: '9' },
      { osMinorVersion: '8' },
      { osMinorVersion: '999' },
    ];
    const policy = {
      ...policies.edges[0].node,
      hosts,
    };

    render(
      <TestWrapper>
        <PolicyMultiversionRules policy={policy} />
      </TestWrapper>
    );

    expect(screen.getAllByRole('tab').length).toEqual(
      policy.policy.profiles.filter(({ osMinorVersion }) => !!osMinorVersion)
        .length
    );
  });
});
