import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestWrapper from '@/Utilities/TestWrapper';

import { EditPolicy } from './EditPolicy.js';
jest.mock('Mutations');
jest.mock('Utilities/hooks/useDocumentTitle', () => ({
  useTitleEntity: () => ({}),
  setTitle: () => ({}),
}));

import useAPIV2FeatureFlag from '../../Utilities/hooks/useAPIV2FeatureFlag';
jest.mock('../../Utilities/hooks/useAPIV2FeatureFlag');

describe('EditPolicy', () => {
  beforeEach(() => {
    useAPIV2FeatureFlag.mockImplementation(() => false);
  });
  const defaultProps = {
    onClose: jest.fn(),
    dispatch: jest.fn(),
    change: jest.fn(),
  };

  it('expect to render without error', () => {
    render(
      <TestWrapper>
        <EditPolicy {...defaultProps} />
      </TestWrapper>
    );

    expect(screen.getByLabelText('Edit')).toBeInTheDocument();
  });

  // TODO Add test with proper mock data
});
