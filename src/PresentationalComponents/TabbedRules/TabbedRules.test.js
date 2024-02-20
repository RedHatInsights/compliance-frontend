import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestWrapper from '@/Utilities/TestWrapper';
import TabbedRules from './TabbedRules';
import { policies } from '@/__fixtures__/policies';

describe('TabbedRules', () => {
  it('renders tabs for new minor versions', () => {
    const profiles = policies.edges[0].node.policy.profiles;
    const tabsData = profiles.map((profile) => ({
      profile,
      newOsMinorVersion: profile.osMinorVersion ? undefined : '99',
    }));

    render(
      <TestWrapper>
        <TabbedRules tabsData={tabsData} />
      </TestWrapper>
    );

    expect(screen.getByText('SSG version: 0.1.49')).toBeInTheDocument();
  });
});
