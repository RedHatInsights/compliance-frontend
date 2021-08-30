import NoReportsState from './NoReportsState';

describe('NoReportsState', () => {
  it('with a system having multiple policies', () => {
    const wrapper = shallow(
      <NoReportsState system={{ hasPolicy: true, policies: [{}, {}] }} />
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('with a system having policies', () => {
    const wrapper = shallow(
      <NoReportsState system={{ hasPolicy: true, policies: [{}] }} />
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('with a system having no policies', () => {
    const wrapper = shallow(
      <NoReportsState system={{ hasPolicy: false, policies: [] }} />
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('with a system missing policies prop', () => {
    const wrapper = shallow(<NoReportsState system={{ hasPolicy: false }} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('with a system having missing hasPolicy prop', () => {
    const wrapper = shallow(<NoReportsState system={{}} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('with a system having a policy but missing test results', () => {
    const wrapper = shallow(
      <NoReportsState system={{ testResultProfiles: [] }} />
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('with a system having a policy and test results', () => {
    const wrapper = shallow(
      <NoReportsState system={{ testResultProfiles: [{}] }} />
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
