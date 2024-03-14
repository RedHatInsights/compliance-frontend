import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import ErrorCard from './ErrorCard';

describe('ErrorCard', () => {
  it('expect to render without error', () => {
    render(<ErrorCard />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('expect to render with error', () => {
    const errorText = 'Some kind of error';
    render(<ErrorCard errorMsg={errorText} />);

    expect(screen.getByText(errorText)).toBeInTheDocument();
  });
});
