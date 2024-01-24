import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import TabbedRules from './TabbedRules';
import { policies } from '@/__fixtures__/policies';
import { useQuery } from '@apollo/client';

jest.mock('@apollo/client');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: jest.fn(() => ({
    pathname: '/path/name',
    state: {},
  })),
}));

useQuery.mockImplementation(() => ({
  data: {},
  error: undefined,
  loading: undefined,
}));

describe('TabbedRules', () => {
  it('renders tabs for new minor versions', () => {
    const profiles = policies.edges[0].node.policy.profiles;
    const tabsData = profiles.map((profile) => ({
      profile,
      newOsMinorVersion: profile.osMinorVersion ? undefined : '99',
    }));
    render(<TabbedRules tabsData={tabsData} />);

    expect(screen.getByText('SSG version: 0.1.49')).toBeInTheDocument();
  });
});
