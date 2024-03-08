import propTypes from 'prop-types';
import { render } from '@testing-library/react';
import { fireEvent, screen, within } from '@testing-library/dom';
import { MemoryRouter } from 'react-router-dom';
import buildPolicy from '@/__factories__/policies.js';
import usePolicyQuery from 'Utilities/hooks/usePolicyQuery';
import useBenchmarksQuery from 'Utilities/hooks/useBenchmarksQuery';
import EditPolicy from './EditPolicy';
import useOnSavePolicy from 'Utilities/hooks/useOnSavePolicy';

jest.mock('Utilities/hooks/useOnSavePolicy');
useOnSavePolicy.mockImplementation(({ onSave }) => {
  return [false, onSave];
});
jest.mock('Utilities/hooks/usePolicyQuery');
jest.mock('Utilities/hooks/useBenchmarksQuery');
useBenchmarksQuery.mockImplementation(() => {
  return { data: {}, loading: false, error: false };
});

const mockRoute = {
  title: 'Edit Policy',
  setTitle: () => ({}),
};

const TestWrapper = ({ children }) => <MemoryRouter>{children}</MemoryRouter>;
TestWrapper.propTypes = { children: propTypes.node };

describe('EditPolicy', () => {
  it('expected to render', () => {
    usePolicyQuery.mockImplementation(() => {
      return { data: { profile: buildPolicy() }, loading: false, error: false };
    });
    render(
      <TestWrapper>
        <EditPolicy route={mockRoute} />
      </TestWrapper>
    );

    const tabBar = screen.getByRole('tablist');
    expect(within(tabBar).getByText('Rules')).not.toBeNull();
    expect(within(tabBar).getByText('Systems')).not.toBeNull();

    fireEvent.click(screen.getByLabelText('Close'));
  });
});
