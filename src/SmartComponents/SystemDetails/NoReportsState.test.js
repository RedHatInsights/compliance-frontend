import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import NoReportsState from './NoReportsState';

describe('NoReportsState', () => {
  it('with a system having policies', () => {
    render(<NoReportsState system={{ policies: [{}] }} />);

    expect(
      screen.getByText(
        'This system is part of 1 policy, but has not returned any results.'
      )
    ).toBeInTheDocument();
  });

  it('with a system having multiple policies', () => {
    render(<NoReportsState system={{ policies: [{}, {}] }} />);

    expect(
      screen.getByText(
        'This system is part of 2 policies, but has not returned any results.'
      )
    ).toBeInTheDocument();
  });
});
