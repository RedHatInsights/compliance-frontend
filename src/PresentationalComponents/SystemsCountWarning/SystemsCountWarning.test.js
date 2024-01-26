import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import SystemsCountWarning from './SystemsCountWarning';

describe('SystemsCountWarning', () => {
  it('expect to render without error', () => {
    render(<SystemsCountWarning count={0} />);

    expect(screen.getByText('No Systems')).toBeInTheDocument();
  });

  it('expect to render compact without error', () => {
    render(<SystemsCountWarning count={10} variant="compact" />);

    expect(screen.getByText('No Systems')).toBeInTheDocument();
  });

  it('expect to render count without error', () => {
    render(<SystemsCountWarning count={0} variant="count" />);

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('expect to render full without error', () => {
    render(<SystemsCountWarning count={0} variant="full" />);

    expect(
      screen.getByText('Policies without systems will not have reports.')
    ).toBeInTheDocument();
  });
});
