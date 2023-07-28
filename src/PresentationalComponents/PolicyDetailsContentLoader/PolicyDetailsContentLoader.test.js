import { render } from '@testing-library/react';
import PolicyDetailsContentLoader from './PolicyDetailsContentLoader';

describe('PolicyDetailsContentLoader', () => {
  it('expect to render without error', () => {
    const { asFragment } = render(<PolicyDetailsContentLoader />);

    expect(asFragment()).toMatchSnapshot();
  });
});
