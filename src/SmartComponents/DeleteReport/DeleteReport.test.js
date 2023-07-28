import { render } from '@testing-library/react';

import { useLocation } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { dispatchAction } from 'Utilities/Dispatcher';

jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock('@apollo/client');
jest.mock('Utilities/Dispatcher');

import DeleteReport from './DeleteReport.js';

describe('DeleteReport', () => {
  beforeEach(() => {
    useLocation.mockImplementation(() => ({
      state: {
        profile: { id: 'ID1' },
      },
    }));
    useMutation.mockImplementation((query, options) => {
      return [
        function () {
          options.onCompleted();
        },
      ];
    });
    dispatchAction.mockImplementation(() => {});
  });

  it('expect to render an open modal without error', () => {
    const { container } = render(<DeleteReport />);

    expect(container).toMatchSnapshot();
  });
});
