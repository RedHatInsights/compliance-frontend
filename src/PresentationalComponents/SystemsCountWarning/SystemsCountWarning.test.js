import { render } from '@testing-library/react';
import SystemsCountWarning from './SystemsCountWarning';

describe('SystemsCountWarning', () => {
  it('expect to render without error', () => {
    const { asFragment } = render(<SystemsCountWarning count={0} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render compact without error', () => {
    const { asFragment } = render(
      <SystemsCountWarning count={10} variant="compact" />
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render count without error', () => {
    const { asFragment } = render(
      <SystemsCountWarning count={0} variant="count" />
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render full without error', () => {
    const { asFragment } = render(
      <SystemsCountWarning count={0} variant="full" />
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
