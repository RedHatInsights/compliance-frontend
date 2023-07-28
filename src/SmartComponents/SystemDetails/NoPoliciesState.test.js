import { render } from '@testing-library/react';

import NoPoliciesState from './NoPoliciesState';

describe('NoPoliciesState', () => {
  it('with a system having policies', () => {
    const { asFragment } = render(<NoPoliciesState />);

    expect(asFragment()).toMatchSnapshot();
  });
});
