import { render } from '@testing-library/react';

import ComplianceEmptyState from './ComplianceEmptyState';
import { useQuery } from '@apollo/client';
jest.mock('@apollo/client');
jest.mock('apollo-boost');

describe('ComplianceEmptyState', () => {
  it('expect to render without error if no policies exist', () => {
    useQuery.mockImplementation(() => ({
      data: { profiles: { totalCount: 0 } },
      error: undefined,
      loading: undefined,
    }));
    const { asFragment } = render(<ComplianceEmptyState client={{}} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render different message if one policy exists', () => {
    useQuery.mockImplementation(() => ({
      data: { profiles: { totalCount: 1 } },
      error: undefined,
      loading: undefined,
    }));
    const { asFragment } = render(<ComplianceEmptyState client={{}} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render different message if many policies exist', () => {
    useQuery.mockImplementation(() => ({
      data: { profiles: { totalCount: 2 } },
      error: undefined,
      loading: undefined,
    }));
    const { asFragment } = render(<ComplianceEmptyState client={{}} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
