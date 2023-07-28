import { render } from '@testing-library/react';
import ProgressBar from './ProgressBar';

describe('ProgressBar', () => {
  it('expect to render progress bar without error', () => {
    const { asFragment } = render(<ProgressBar percent={0} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render failed bar without error', () => {
    const { asFragment } = render(<ProgressBar percent={50} failed />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render success bar without error', () => {
    const { asFragment } = render(<ProgressBar percent={100} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
