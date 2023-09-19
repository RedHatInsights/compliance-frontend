import React from 'react';
import { render } from '@testing-library/react';
import { queryByText } from '@testing-library/dom';

import ComplianceEmptyState from './ComplianceEmptyState';
import { useQuery } from '@apollo/client';

jest.mock('@apollo/client');
jest.mock('apollo-boost');

jest.mock('@redhat-cloud-services/frontend-components/InsightsLink', () => ({
  __esModule: true,
  default: ({ children, isDisabled, ...props }) => {
    return (
      <button {...props} disabled={isDisabled}>
        {children}
      </button>
    );
  },
}));

describe('ComplianceEmptyState', () => {
  it('expect to render without error if no policies exist', () => {
    useQuery.mockImplementation(() => ({
      data: { profiles: { totalCount: 0 } },
      error: undefined,
      loading: undefined,
    }));
    const { container } = render(<ComplianceEmptyState client={{}} />);

    expect(queryByText(container, 'No policies')).not.toBeNull();
  });

  it('expect to render different message if one policy exists', () => {
    useQuery.mockImplementation(() => ({
      data: { profiles: { totalCount: 1 } },
      error: undefined,
      loading: undefined,
    }));
    const { container } = render(<ComplianceEmptyState client={{}} />);

    expect(queryByText(container, '1 policy')).not.toBeNull();
    expect(
      queryByText(container, 'has been created but has no reports.')
    ).not.toBeNull();
  });

  it('expect to render different message if many policies exist', () => {
    useQuery.mockImplementation(() => ({
      data: { profiles: { totalCount: 2 } },
      error: undefined,
      loading: undefined,
    }));
    const { container } = render(<ComplianceEmptyState client={{}} />);

    expect(queryByText(container, '2 policies')).not.toBeNull();
  });
});
