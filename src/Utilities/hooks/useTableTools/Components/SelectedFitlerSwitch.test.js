import SelectedFilterSwitch from './SelectedFilterSwitch';

describe('SelectedFilterSwitch', () => {
  it('expect to render without error', () => {
    const wrapper = shallow(<SelectedFilterSwitch />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('expect to render without error', () => {
    const wrapper = shallow(<SelectedFilterSwitch isChecked={false} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
