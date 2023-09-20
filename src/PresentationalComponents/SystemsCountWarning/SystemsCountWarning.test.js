import { render } from '@testing-library/react';
import { queryByText } from '@testing-library/dom';

import SystemsCountWarning from './SystemsCountWarning';

describe('SystemsCountWarning', () => {
  it('expect to render without error', () => {
    const { container } = render(<SystemsCountWarning count={0} />);

    expect(queryByText(container, 'No Systems')).not.toBeNull();
  });

  it('expect to render compact without error', () => {
    const { container } = render(
      <SystemsCountWarning count={10} variant="compact" />
    );

    expect(queryByText(container, 'No Systems')).not.toBeNull();
  });

  it('expect to render count without error', () => {
    const { container } = render(
      <SystemsCountWarning count={0} variant="count" />
    );

    expect(queryByText(container, '0')).not.toBeNull();
  });

  it('expect to render full without error', () => {
    const { container } = render(
      <SystemsCountWarning count={0} variant="full" />
    );

    expect(
      queryByText(container, 'Policies without systems will not have reports.')
    ).not.toBeNull();
  });
});
