import { render } from '@testing-library/react';
import { queryByText, queryAllByText } from '@testing-library/dom';
import SystemPolicyCards from './SystemPolicyCards';

describe('SystemPolicyCards component', () => {
  const currentTime = new Date('2021-03-06T06:20:13Z');
  const pastTime = new Date('2021-03-06T06:20:13Z');
  pastTime.setYear(pastTime.getFullYear() - 2);

  const policies = [
    {
      rulesPassed: 30,
      rulesFailed: 10,
      score: 75,
      lastScanned: pastTime.toISOString(),
      refId: 'xccdf_org.ssgproject.content_profile_pci-dss',
      name: 'PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7',
      policyType: 'PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7',
      compliant: false,
      supported: true,
      benchmark: { version: '0.1.45' },
    },
    {
      rulesPassed: 1,
      rulesFailed: 99,
      score: 0,
      lastScanned: null,
      refId: 'xccdf_org.ssgproject.content_profile_pci-dss2',
      name: 'PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 8',
      policyType: 'PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 8',
      compliant: false,
      supported: true,
      benchmark: { version: '0.1.46' },
    },
  ];

  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(currentTime);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should render loading state', () => {
    const { container } = render(
      <SystemPolicyCards policies={policies} loading={true} />
    );

    policies.forEach(({ name }) => {
      expect(queryByText(container, name)).toBeNull();
    });
  });

  it('should render policy cards', () => {
    const { container } = render(
      <SystemPolicyCards policies={policies} loading={false} />
    );

    policies.forEach(({ name }) => {
      expect(queryAllByText(container, name)[0]).not.toBeNull();
    });
  });
});
