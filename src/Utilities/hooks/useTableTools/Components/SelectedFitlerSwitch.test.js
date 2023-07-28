import { render } from '@testing-library/react';
import SelectedFilterSwitch from './SelectedFilterSwitch';

describe('SelectedFilterSwitch', () => {
  it('expect to render without error', () => {
    const { asFragment } = render(<SelectedFilterSwitch />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render without error', () => {
    const { asFragment } = render(<SelectedFilterSwitch isChecked={false} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
