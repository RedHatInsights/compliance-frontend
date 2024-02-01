import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestWrapper from '@/Utilities/TestWrapper';

import { useMutation } from '@apollo/client';
import { dispatchAction } from 'Utilities/Dispatcher';

jest.mock('@apollo/client');
jest.mock('Utilities/Dispatcher');

import DeleteReport from './DeleteReport.js';

describe('DeleteReport', () => {
  beforeEach(() => {
    useMutation.mockImplementation((_query, options) => {
      return [
        function () {
          options.onCompleted();
        },
      ];
    });
    dispatchAction.mockImplementation(() => {});
  });

  it('expect to render an open modal without error', () => {
    render(
      <TestWrapper>
        <DeleteReport />
      </TestWrapper>
    );

    expect(
      screen.getByText('Deleting a report is permanent and cannot be undone.')
    ).toBeInTheDocument();
  });

  // TODO this should also test the deleting as well
});
