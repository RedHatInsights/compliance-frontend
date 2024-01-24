import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

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
    render(<ComplianceScore {...system} />);

    expect(screen.getByText('10%')).toBeInTheDocument();
  });

  it('should show 0% score instead if the system score is 0', () => {
    const system = {
      rulesFailed: 300,
      score: 0,
      supported: true,
      compliant: false,
    };
    render(<ComplianceScore {...system} />);

    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('should show a success icon if the host is compliant', () => {
    const system = {
      rulesFailed: 3,
      score: 91,
      supported: true,
      profiles: [{ compliant: true }, { compliant: true }],
    };
    render(<ComplianceScore {...system} />);

    expect(screen.getByText('91%')).toBeInTheDocument();
  });

  it('should show a question mark icon if the host has no rules passed or failed', () => {
    render(<ComplianceScore />);

    expect(screen.getByText('Unsupported')).toBeInTheDocument();
  });
});
