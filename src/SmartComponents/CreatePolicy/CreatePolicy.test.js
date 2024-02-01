import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestWrapper from '@/Utilities/TestWrapper';

import { useQuery } from '@apollo/client';
import { benchmarksQuery } from '@/__fixtures__/benchmarks_rules.js';

jest.mock('@apollo/client');

import CreatePolicyForm from './CreatePolicy.js';

describe('CreatePolicyForm', () => {
  it('expect to render the wizard', () => {
    // TODO Replace with proper data and extend tests
    useQuery.mockImplementation(() => ({
      data: { latestBenchmarks: benchmarksQuery },
      loading: false,
    }));

    render(
      <TestWrapper>
        <CreatePolicyForm />
      </TestWrapper>
    );

    expect(
      screen.getByText(
        'Select the operating system and policy type for this policy.'
      )
    ).toBeInTheDocument();
  });
});
