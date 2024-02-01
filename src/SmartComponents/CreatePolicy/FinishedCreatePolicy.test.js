import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestWrapper from '@/Utilities/TestWrapper';

import { FinishedCreatePolicy } from './FinishedCreatePolicy.js';
import { usePolicy } from 'Mutations';
jest.mock('Mutations');
jest.mock('Utilities/Dispatcher', () => ({
  ...jest.requireActual('Utilities/Dispatcher'),
  dispatchNotification: () => ({}),
}));

describe('FinishedCreatePolicy', () => {
  const defaultProps = {
    client: {},
    benchmarkId: 'BENCH_ID',
    businessObjective: {},
    cloneFromProfileId: 'CLONE_ID',
    refId: 'REF_ID',
    name: 'NAME',
    description: 'DESCRIPTION',
    complianceThreshold: 50,
    systemIds: [],
    selectedRuleRefIds: [],
  };

  it('expect to render without error', () => {
    usePolicy.mockImplementation(() => () => Promise.resolve({}));
    const onClose = () => {};

    render(
      <TestWrapper>
        <FinishedCreatePolicy {...defaultProps} onClose={onClose} />
      </TestWrapper>
    );

    expect(
      screen.getByRole('heading', { name: 'Creating policy' })
    ).toBeInTheDocument();
  });
});
