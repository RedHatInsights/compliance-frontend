import { render } from '@testing-library/react';
import { useQuery } from '@apollo/client';
import { benchmarksQuery } from '@/__fixtures__/benchmarks_rules.js';

jest.mock('@apollo/client');

import { CreatePolicyForm } from './CreatePolicy.js';

jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

describe('CreatePolicyForm', () => {
  it('expect to render the wizard', () => {
    useQuery.mockImplementation(() => ({
      data: { latestBenchmarks: benchmarksQuery },
      error: false,
      loading: false,
    }));
    const { asFragment } = render(<CreatePolicyForm />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render the wizard with enableNext on systems', () => {
    useQuery.mockImplementation(() => ({
      data: { latestBenchmarks: benchmarksQuery },
      error: false,
      loading: false,
    }));
    const { container } = render(
      <CreatePolicyForm systemIds={['123', '456']} />
    );
    expect(
      container
        .find('Wizard')
        .prop('steps')
        .find(({ name }) => name === 'Systems').enableNext
    ).toMatchSnapshot();
  });
});
