import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestWrapper from '@/Utilities/TestWrapper';
import usePolicies from 'Utilities/hooks/api/usePolicies';

jest.mock('Utilities/hooks/api/usePolicies', () => jest.fn());

import ComplianceEmptyState from './ComplianceEmptyState';

describe('ComplianceEmptyState', () => {
  it('expect to render without error if no policies exist', () => {
    usePolicies.mockImplementation(() => ({
      data: { meta: { total: 0 } },
      error: undefined,
      loading: undefined,
    }));
    render(
      <TestWrapper>
        <ComplianceEmptyState />
      </TestWrapper>
    );

    expect(screen.getByText('No policies')).toBeInTheDocument();
    expect(
      screen.queryByText('has been created but have no reports.')
    ).not.toBeInTheDocument();
  });

  it('expect to render different message if one policy exists', () => {
    usePolicies.mockImplementation(() => ({
      data: { meta: { total: 1 } },
      error: undefined,
      loading: undefined,
    }));
    render(
      <TestWrapper>
        <ComplianceEmptyState />
      </TestWrapper>
    );

    expect(screen.getByText('1 policy')).toBeInTheDocument();
    expect(
      screen.getByText('has been created but has no reports.')
    ).toBeInTheDocument();
  });

  it('expect to render different message if many policies exist', () => {
    usePolicies.mockImplementation(() => ({
      data: { meta: { total: 2 } },
      error: undefined,
      loading: undefined,
    }));

    render(
      <TestWrapper>
        <ComplianceEmptyState />
      </TestWrapper>
    );

    expect(screen.getByText('2 policies')).toBeInTheDocument();
    expect(
      screen.getByText('have been created but have no reports.')
    ).toBeInTheDocument();
  });
});
