import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import SelectedFilterSwitch from './SelectedFilterSwitch';

describe('SelectedFilterSwitch', () => {
  it('expect to render without error', () => {
    render(<SelectedFilterSwitch />);

    expect(screen.getByRole('checkbox', { checked: true })).toBeInTheDocument();
  });

  it('expect to render without error', () => {
    render(<SelectedFilterSwitch isChecked={true} />);

    expect(screen.getByRole('checkbox', { checked: true })).toBeInTheDocument();
  });
});
