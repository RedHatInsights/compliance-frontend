import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

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
    render(<ComplianceEmptyState client={{}} />);

    expect(screen.getByText('No policies')).toBeInTheDocument();
  });

  it('expect to render different message if one policy exists', () => {
    useQuery.mockImplementation(() => ({
      data: { profiles: { totalCount: 1 } },
      error: undefined,
      loading: undefined,
    }));
    render(<ComplianceEmptyState client={{}} />);

    expect(screen.getByText('1 policy')).toBeInTheDocument();
    expect(
      screen.getByText('has been created but has no reports.')
    ).toBeInTheDocument();
  });

  it('expect to render different message if many policies exist', () => {
    useQuery.mockImplementation(() => ({
      data: { profiles: { totalCount: 2 } },
      error: undefined,
      loading: undefined,
    }));
    render(<ComplianceEmptyState client={{}} />);

    expect(screen.getByText('2 policies')).toBeInTheDocument();
  });
});
