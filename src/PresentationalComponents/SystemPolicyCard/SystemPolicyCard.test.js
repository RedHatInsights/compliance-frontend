import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import SystemPolicyCard from './SystemPolicyCard';

describe('SystemPolicyCard component', () => {
  const currentTime = new Date();
  currentTime.setMonth(currentTime.getMonth() - 6);
  const policy = {
    failed_rule_count: 10,
    score: 75,
    end_time: currentTime.toISOString(),
    ref_id: 'xccdf_org.ssgproject.content_profile_pci-dss',
    title: 'PCI-DSS Policy',
    profile_title: 'PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7',
    compliant: false,
    supported: true,
    security_guide_version: '0.1.45',
  };

  it('should render non compliant policy', () => {
    render(<SystemPolicyCard policy={policy} />);

    expect(screen.getByText('Not compliant')).toBeInTheDocument();
  });

  it('should render compliant policy', () => {
    const compliantPolicy = {
      ...policy,
      compliant: true,
    };
    render(<SystemPolicyCard policy={compliantPolicy} />);

    expect(screen.getByText('Compliant')).toBeInTheDocument();
  });

  it('should render an unsupported policy', () => {
    const unsupportedPolicy = {
      ...policy,
      supported: false,
    };
    render(<SystemPolicyCard policy={unsupportedPolicy} />);

    expect(
      screen.getByText('Unsupported SSG version (0.1.45)'),
    ).toBeInTheDocument();
  });
});
