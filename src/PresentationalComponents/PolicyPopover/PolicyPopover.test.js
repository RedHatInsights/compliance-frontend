import { render } from '@testing-library/react';
import PolicyPopover from './PolicyPopover';
import { policies } from '@/__fixtures__/policies.js';

describe('PolicyPopover', () => {
  it('expect to render without error', () => {
    const { asFragment } = render(
      <PolicyPopover profile={policies.edges[0].node} />
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
