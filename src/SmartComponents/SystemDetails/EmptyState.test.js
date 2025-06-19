import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestWrapper from '@/Utilities/TestWrapper';

import EmptyState from './EmptyState.js';
import useSystem from 'Utilities/hooks/api/useSystem';

jest.mock('Utilities/hooks/api/useSystem', () => jest.fn());

describe('EmptyState for systemDetails', () => {
  it('expect to render loading state while waiting for data', () => {
    useSystem.mockImplementation(() => ({
      data: { data: undefined },
      error: undefined,
      loading: undefined,
    }));
    render(
      <TestWrapper>
        <EmptyState inventoryId={'123'} />
      </TestWrapper>,
    );

    expect(screen.getByLabelText('Contents')).toHaveAttribute(
      'aria-valuetext',
      'Loading...',
    );
  });

  it('expect to render NotConnected component', () => {
    useSystem.mockImplementation(() => ({
      data: { data: { display_name: 'foo', policies: [], insights_id: '' } },
      error: undefined,
      loading: undefined,
    }));
    render(
      <TestWrapper>
        <EmptyState inventoryId={'123'} />
      </TestWrapper>,
    );

    expect(
      screen.getByText(`This system isn’t connected to Insights yet`),
    ).toBeInTheDocument();
  });

  it('expect to render NoPoliciesState component for Inventory', () => {
    useSystem.mockImplementation(() => ({
      data: { data: { display_name: 'foo', policies: [], insights_id: '123' } },
      error: undefined,
      loading: undefined,
    }));
    render(
      <TestWrapper>
        <EmptyState inventoryId={'123'} />
      </TestWrapper>,
    );

    expect(
      screen.getByText(
        'This system is not part of any SCAP policies defined within Compliance.',
      ),
    ).toBeInTheDocument();
  });

  it('expect to render NoPoliciesState component for Compliance SystemDetails', () => {
    useSystem.mockImplementation(() => ({}));

    render(
      <TestWrapper>
        <EmptyState
          inventoryId={'123'}
          system={{ insights_id: '123', policies: [] }}
        />
      </TestWrapper>,
    );

    expect(useSystem).toHaveBeenCalledWith({
      params: ['123'],
      skip: { insights_id: '123', policies: [] }, // Ensure correct 'skip' value
    });

    expect(
      screen.getByText(
        'This system is not part of any SCAP policies defined within Compliance.',
      ),
    ).toBeInTheDocument();
  });

  it('expect to render NoReportsState component', () => {
    useSystem.mockImplementation(() => ({
      data: {
        data: { display_name: 'foo', policies: [{}, {}], insights_id: '123' },
      },
      error: undefined,
      loading: undefined,
    }));
    render(
      <TestWrapper>
        <EmptyState inventoryId={'123'} />
      </TestWrapper>,
    );

    expect(screen.getByText('No results reported')).toBeInTheDocument();
    expect(
      screen.getByText(
        `This system is part of 2 policies, but has not returned any results.`,
      ),
    ).toBeInTheDocument();
  });

  it('expect to render NoReportsState component', () => {
    useSystem.mockImplementation(() => ({}));

    render(
      <TestWrapper>
        <EmptyState
          inventoryId={'123'}
          system={{ insights_id: '123', policies: [{}] }}
        />
      </TestWrapper>,
    );

    expect(useSystem).toHaveBeenCalledWith({
      params: ['123'],
      skip: { insights_id: '123', policies: [{}] }, // Ensure correct 'skip' value
    });

    expect(screen.getByText('No results reported')).toBeInTheDocument();
    expect(
      screen.getByText(
        `This system is part of 1 policy, but has not returned any results.`,
      ),
    ).toBeInTheDocument();
  });
});
