import { render } from '@testing-library/react';
import ProgressBar from './ProgressBar';

describe('ProgressBar', () => {
  it('expect to render progress bar without error', () => {
    const component = <ProgressBar percent={0} />;
    const { asFragment } = render(component);

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render failed bar without error', () => {
    const component = <ProgressBar percent={50} failed />;
    const { asFragment } = render(component);

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render success bar without error', () => {
    const component = <ProgressBar percent={100} />;
    const { asFragment } = render(component);

    expect(asFragment()).toMatchSnapshot();
  });
});
