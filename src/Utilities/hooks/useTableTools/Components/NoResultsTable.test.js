import { render } from '@testing-library/react';

import { NoResultsTable } from './NoResultsTable';

describe('NoResultsTable', () => {
  it('expect to render without error', () => {
    const { asFragment } = render(<NoResultsTable />);

    expect(asFragment()).toMatchSnapshot();
  });
});
