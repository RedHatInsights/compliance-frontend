import { render, screen } from '@testing-library/react';
import { within } from '@testing-library/react';
import '@testing-library/jest-dom';

import propTypes from 'prop-types';
import { MemoryRouter } from 'react-router-dom';

import CompliancePolicies from './CompliancePolicies.js';
import usePoliciesCount from 'Utilities/hooks/usePoliciesCount';
import usePolicies from 'Utilities/hooks/api/usePolicies';
import { buildPolicies } from '../../__factories__/policies';

const TestWrapper = ({ children }) => <MemoryRouter>{children}</MemoryRouter>;
TestWrapper.propTypes = { children: propTypes.node };

const policiesData = buildPolicies(11);
jest.mock('Utilities/hooks/usePoliciesCount', () => jest.fn());
jest.mock('Utilities/hooks/api/usePolicies', () => jest.fn());

describe('CompliancePolicies', () => {
  it('expect to render without error', () => {
    usePoliciesCount.mockImplementation(() => policiesData.length);
    usePolicies.mockImplementation(() => ({
      data: { data: policiesData, meta: { total: policiesData.length } },
      loading: false,
      error: null,
      refetch: () => {},
    }));

    render(
      <TestWrapper>
        <CompliancePolicies />
      </TestWrapper>
    );
    const tableRowsLength = policiesData.length + 1; // th also has 1 row

    expect(
      within(screen.getByLabelText('Policies')).queryAllByRole('row').length
    ).toEqual(tableRowsLength);
  });

  it('expect to render emptystate', () => {
    usePoliciesCount.mockImplementation(() => 0);
    usePolicies.mockImplementation(() => ({
      data: { data: [], meta: { total: 0 } },
      loading: false,
      error: null,
      refetch: () => {},
    }));

    render(
      <TestWrapper>
        <CompliancePolicies />
      </TestWrapper>
    );

    expect(screen.getByText('No policies')).toBeInTheDocument();
  });

  it('expect to render an error', () => {
    usePoliciesCount.mockImplementation(() => 0);
    usePolicies.mockImplementation(() => ({
      data: { data: [], meta: { total: 0 } },
      loading: false,
      error: 'Something went wrong',
      refetch: () => {},
    }));

    render(
      <TestWrapper>
        <CompliancePolicies />
      </TestWrapper>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('expect to render loading', () => {
    usePoliciesCount.mockImplementation(() => 0);
    usePolicies.mockImplementation(() => ({
      data: { data: [], meta: { total: 0 } },
      loading: true,
      error: null,
      refetch: () => {},
    }));

    render(
      <TestWrapper>
        <CompliancePolicies />
      </TestWrapper>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument(1);
  });
});
