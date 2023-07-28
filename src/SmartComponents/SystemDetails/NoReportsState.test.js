import { render } from '@testing-library/react';

import NoReportsState from './NoReportsState';

describe('NoReportsState', () => {
  it('with a system having policies', () => {
    const { asFragment } = render(<NoReportsState system={{ policies: [{}] }} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('with a system having multiple policies', () => {
    const { asFragment } = render(<NoReportsState system={{ policies: [{}, {}] }} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
