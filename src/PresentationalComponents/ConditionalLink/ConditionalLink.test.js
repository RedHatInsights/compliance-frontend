import { render } from '@testing-library/react';
import { queryByText } from '@testing-library/dom';

import ConditionalLink from './ConditionalLink';

describe('ConditionalLink', () => {
  it('expect to not render a link with no href passed', () => {
    const { container } = render(
      <ConditionalLink>
        <span>Test Child</span>
      </ConditionalLink>
    );

    expect(container.querySelector('a')).toBeNull();
  });

  it('expect to render a link with a href passed', () => {
    const { container } = render(<ConditionalLink href="https://redhat.com" />);

    expect(container.querySelector('a')).not.toBeNull();
  });

  it('expect to render a link and children with a href passed', () => {
    const { container } = render(
      <ConditionalLink href="https://redhat.com">
        <span>Test Child</span>
      </ConditionalLink>
    );

    expect(container.querySelector('a')).not.toBeNull();
    expect(queryByText(container, 'Test Child')).not.toBeNull();
  });
});
