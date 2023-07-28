import { render } from '@testing-library/react';
import SystemPolicyCard from './SystemPolicyCard';
import { IntlProvider } from 'react-intl';

describe('SystemPolicyCard component', () => {
  const currentTime = new Date();
  currentTime.setMonth(currentTime.getMonth() - 6);
  const policy = {
    rulesPassed: 30,
    rulesFailed: 10,
    score: 75,
    lastScanned: currentTime.toISOString(),
    refId: 'xccdf_org.ssgproject.content_profile_pci-dss',
    name: 'PCI-DSS Policy',
    policyType: 'PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7',
    compliant: false,
    supported: true,
    benchmark: { version: '0.1.45' },
    policy: {
      name: 'PCI-DSS Policy',
    },
  };

  it('should render policy', () => {
    const { asFragment } = render(
      <IntlProvider locale={navigator.language}>
        <SystemPolicyCard policy={policy} />
      </IntlProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render an unsupported policy', () => {
    const unsupportedPolicy = {
      ...policy,
      supported: false,
    };
    const { asFragment } = render(
      <IntlProvider locale={navigator.language}>
        <SystemPolicyCard policy={unsupportedPolicy} />
      </IntlProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
