import NoReportsState from './NoReportsState';

describe('NoReportsState', () => {
  it('with a system having policies', () => {
    const wrapper = shallow(<NoReportsState system={{ policies: [{}] }} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('with a system having multiple policies', () => {
    const wrapper = shallow(<NoReportsState system={{ policies: [{}, {}] }} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
