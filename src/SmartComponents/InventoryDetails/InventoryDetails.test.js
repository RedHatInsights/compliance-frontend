import { render } from '@testing-library/react';

import InventoryDetails from './InventoryDetails';

describe('InventoryDetails', () => {
  it('expect to render without error', () => {
    const { asFragment } = render(<InventoryDetails />);

    expect(asFragment()).toMatchSnapshot();
  });
});
