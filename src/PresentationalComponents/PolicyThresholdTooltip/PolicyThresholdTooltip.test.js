import { render } from '@testing-library/react';
import PolicyThresholdTooltip from './PolicyThresholdTooltip';

describe('PolicyThresholdTooltip', () => {
  it('expect to render without error', () => {
    const { asFragment } = render(<PolicyThresholdTooltip />);

    expect(asFragment()).toMatchSnapshot();
  });
});
