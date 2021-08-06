import ReportsEmptyState from './ReportsEmptyState';

describe('ReportsEmptyState', () => {
  it('expect to render without error', () => {
    const wrapper = shallow(<ReportsEmptyState />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
