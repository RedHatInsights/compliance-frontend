import ComplianceScore from './ComplianceScore';

describe('auxiliary functions to reducer', () => {
  it('should show a danger icon if the host is not compliant', () => {
    const system = {
      rulesPassed: 30,
      rulesFailed: 300,
      score: 10,
      supported: true,
      compliant: false,
    };

    const dangerIcon = mount(<ComplianceScore {...system} />);
    expect(toJson(dangerIcon)).toMatchSnapshot();
  });

  it('should show 0% score instead if the system score is 0', () => {
    const system = {
      rulesFailed: 300,
      score: 0,
      supported: true,
      compliant: false,
    };

    const dangerIcon = mount(<ComplianceScore {...system} />);
    expect(toJson(dangerIcon)).toMatchSnapshot();
  });

  it('should show a success icon if the host is compliant', () => {
    const system = {
      rulesFailed: 3,
      score: 91,
      supported: true,
      profiles: [{ compliant: true }, { compliant: true }],
    };

    const checkIcon = mount(<ComplianceScore {...system} />);
    expect(toJson(checkIcon)).toMatchSnapshot();
  });

  it('should show a question mark icon if the host has no rules passed or failed', () => {
    const questionMarkIcon = mount(<ComplianceScore />);
    expect(toJson(questionMarkIcon)).toMatchSnapshot();
  });
});
