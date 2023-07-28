import { render } from '@testing-library/react';
import ReportsEmptyState from './ReportsEmptyState';

describe('ReportsEmptyState', () => {
  it('expect to render without error', () => {
    const { asFragment } = render(<ReportsEmptyState />);

    expect(asFragment()).toMatchSnapshot();
  });
});
