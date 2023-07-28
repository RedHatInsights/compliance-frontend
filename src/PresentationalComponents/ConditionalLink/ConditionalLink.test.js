import { render } from '@testing-library/react';
import ConditionalLink from './ConditionalLink';

describe('ConditionalLink', () => {
  it('expect to render without error', () => {
    const { asFragment } = render(
      <ConditionalLink href="https://redhat.com" />
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render without error and children', () => {
    const { asFragment } = render(
      <ConditionalLink href="https://redhat.com">
        <span>Test Child</span>
      </ConditionalLink>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
