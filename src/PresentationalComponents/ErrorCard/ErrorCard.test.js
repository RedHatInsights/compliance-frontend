import { render } from '@testing-library/react';
import ErrorCard from './ErrorCard';

describe('ErrorCard', () => {
  it('expect to render without error', () => {
    const { asFragment } = render(<ErrorCard />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render with error', () => {
    const { asFragment } = render(<ErrorCard errorMsg="Some kind of error" />);

    expect(asFragment()).toMatchSnapshot();
  });
});
