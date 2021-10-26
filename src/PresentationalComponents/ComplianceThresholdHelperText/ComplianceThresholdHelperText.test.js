import ComplianceThresholdHelperText from './ComplianceThresholdHelperText';

describe('ComplianceThresholdHelperText', () => {
  const defaultProps = {
    threshold: 100,
  };

  it('expect to render without error', () => {
    const wrapper = shallow(
      <ComplianceThresholdHelperText {...defaultProps} />
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
