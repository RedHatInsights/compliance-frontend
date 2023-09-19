import { render } from '@testing-library/react';
import { queryByText } from '@testing-library/dom';

import ErrorCard from './ErrorCard';

describe('ErrorCard', () => {
  it('expect to render without error', () => {
    const { container } = render(<ErrorCard />);

    expect(
      queryByText(
        container,
        'There was a problem processing the request. Please try again.'
      )
    ).not.toBeNull();
  });

  it('expect to render with error', () => {
    const errorText = 'Some kind of error';
    const { container } = render(<ErrorCard errorMsg="Some kind of error" />);

    expect(queryByText(container, errorText)).not.toBeNull();
  });
});
