import NoPoliciesState from './NoPoliciesState';

describe('NoPoliciesState', () => {
  it('with a system having policies', () => {
    const wrapper = shallow(<NoPoliciesState />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
