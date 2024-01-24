import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import ConditionalLink from './ConditionalLink';

describe('ConditionalLink', () => {
  it('expect to not render a link with no href passed', () => {
    render(
      <ConditionalLink>
        <span>Test Child</span>
      </ConditionalLink>
    );

    expect(screen.queryByRole('a')).not.toBeInTheDocument();
  });

  it('expect to render a link with a href passed', () => {
    render(<ConditionalLink href="https://redhat.com" />);

    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('expect to render a link and children with a href passed', () => {
    render(
      <ConditionalLink href="https://redhat.com">
        <span>Test Child</span>
      </ConditionalLink>
    );

    expect(
      screen.getByRole('link', { name: 'Test Child' })
    ).toBeInTheDocument();
  });
});
