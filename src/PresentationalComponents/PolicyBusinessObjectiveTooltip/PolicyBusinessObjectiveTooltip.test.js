import { render } from '@testing-library/react';
import PolicyBusinessObjectiveTooltip from './PolicyBusinessObjectiveTooltip';

describe('PolicyBusinessObjectiveTooltip', () => {
  it('expect to render without error', () => {
    const { asFragment } = render(<PolicyBusinessObjectiveTooltip />);

    expect(asFragment()).toMatchSnapshot();
  });
});
