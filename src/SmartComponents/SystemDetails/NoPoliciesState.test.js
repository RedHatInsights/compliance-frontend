import NoPoliciesState from './NoPoliciesState';

describe('NoPoliciesState', () => {
  it('with a system having policies', () => {
    const wrapper = shallow(<NoPoliciesState system={{ hasPolicy: true }} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('with a system having no policies', () => {
    const wrapper = shallow(<NoPoliciesState system={{ hasPolicy: false }} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('with a system having missing hasPolicy prop', () => {
    const wrapper = shallow(<NoPoliciesState system={{}} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
