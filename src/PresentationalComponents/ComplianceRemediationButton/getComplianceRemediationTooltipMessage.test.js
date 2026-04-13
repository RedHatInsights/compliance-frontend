import { getComplianceRemediationTooltipMessage } from './getComplianceRemediationTooltipMessage';

describe('getComplianceRemediationTooltipMessage', () => {
  it('returns undefined when there is no selection', () => {
    expect(getComplianceRemediationTooltipMessage()).toBeUndefined();
    expect(getComplianceRemediationTooltipMessage([])).toBeUndefined();
  });

  it('returns unsupported message when every selected system is unsupported', () => {
    expect(
      getComplianceRemediationTooltipMessage([
        { supported: false, failed_rule_count: 0 },
      ]),
    ).toBe('Unsupported systems cannot be remediated.');
  });

  it('returns unsupported message when multiple selected systems are all unsupported', () => {
    expect(
      getComplianceRemediationTooltipMessage([
        { supported: false, failed_rule_count: 0 },
        { supported: false, failed_rule_count: 5 },
      ]),
    ).toBe('Unsupported systems cannot be remediated.');
  });

  it('returns singular compliant message for one fully compliant system', () => {
    expect(
      getComplianceRemediationTooltipMessage([
        { supported: true, failed_rule_count: 0 },
      ]),
    ).toBe('The system is 100% compliant. No remediation is required.');
  });

  it('returns plural compliant message when all selected systems are compliant', () => {
    expect(
      getComplianceRemediationTooltipMessage([
        { supported: true, failed_rule_count: 0 },
        { supported: true, failed_rule_count: 0 },
      ]),
    ).toBe(
      'The selected systems are 100% compliant. No remediation is required.',
    );
  });

  it('returns mixed-selection message when some systems are compliant and some have failures', () => {
    expect(
      getComplianceRemediationTooltipMessage([
        { supported: true, failed_rule_count: 0 },
        { supported: true, failed_rule_count: 3 },
      ]),
    ).toBe(
      'The remediation plan includes only supported systems that failed compliance.',
    );
  });

  it('returns the same message when unsupported systems are selected alongside systems that failed', () => {
    expect(
      getComplianceRemediationTooltipMessage([
        { supported: false, failed_rule_count: 0 },
        { supported: true, failed_rule_count: 3 },
      ]),
    ).toBe(
      'The remediation plan includes only supported systems that failed compliance.',
    );
  });

  it('returns undefined when all selected systems have failures', () => {
    expect(
      getComplianceRemediationTooltipMessage([
        { supported: true, failed_rule_count: 1 },
        { supported: true, failed_rule_count: 2 },
      ]),
    ).toBeUndefined();
  });
});
