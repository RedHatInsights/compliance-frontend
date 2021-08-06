import InventoryDetails from './InventoryDetails';

describe('InventoryDetails', () => {
  it('expect to render without error', () => {
    const wrapper = shallow(<InventoryDetails />);

    expect(
      toJson(wrapper.find('InventoryCmp'), { mode: 'shallow' })
    ).toMatchSnapshot();
  });
});
