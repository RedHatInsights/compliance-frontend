import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import InventoryDetails from './InventoryDetails';

describe('InventoryDetails', () => {
  it('expect to render without error', () => {
    render(<InventoryDetails />);

    expect(
      screen.getByLabelText('Inventory Details Wrapper')
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Inventory Detail Head')).toBeInTheDocument();
  });
});
