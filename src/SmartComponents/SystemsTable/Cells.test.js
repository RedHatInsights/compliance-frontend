import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestWrapper from '@/Utilities/TestWrapper';

import {
  Name,
  SSGVersions,
  Policies,
  FailedRules,
  ComplianceScore,
  LastScanned,
  lastScanned,
} from './Cells';
import { systems } from '@/__fixtures__/systems.js';
import { policies } from '@/__fixtures__/policies.js';
const testSystem = systems[0];

describe('Name', () => {
  it('returns the name', () => {
    render(<Name {...testSystem} />);

    expect(screen.getByText(testSystem.display_name)).toBeInTheDocument();
  });
});

describe('SSGVersions', () => {
  it('returns', () => {
    render(<SSGVersions security_guide_version="0.14.3" supported={true} />);

    expect(screen.getByText(/0\.14\.3/)).toBeInTheDocument();
  });

  it('returns no error without security_guide_version', () => {
    render(<SSGVersions security_guide_version={null} supported={true} />);
    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });
});

describe('Policies', () => {
  it('returns the system policies', () => {
    render(<Policies policies={policies} />);

    const expectedText = `${policies[0].title}, ${policies[1].title}`;
    expect(screen.getByText(new RegExp(expectedText))).toBeInTheDocument();
    expect(screen.getByText('Read more')).toBeInTheDocument();
  });
});

describe('FailedRules', () => {
  it('returns the amount of failed rules', () => {
    render(
      <TestWrapper>
        <FailedRules system_id={testSystem.id} failed_rule_count={28} />
      </TestWrapper>,
    );

    expect(screen.getByText('28')).toBeInTheDocument();
  });

  it('returns no error without failed rules', () => {
    render(
      <TestWrapper>
        <FailedRules system_id={testSystem.id} failed_rule_count={0} />
      </TestWrapper>,
    );

    expect(screen.getByText('0')).toBeInTheDocument();
  });
});

describe('ComplianceScore', () => {
  it('returns', () => {
    render(<ComplianceScore score={40} supported={true} compliant={false} />);

    expect(screen.getByText('40%')).toBeInTheDocument();
  });
});

describe('LastScanned', () => {
  it('returns the relative date the system was last scanned', () => {
    render(<LastScanned end_time="2018-03-16T03:44:05.923774Z" />);

    expect(screen.getByText('8 years ago')).toBeInTheDocument();
  });

  it('returns NEVER', () => {
    render(<LastScanned end_time={null} />);

    expect(screen.getByText('Never')).toBeInTheDocument();
  });

  it('returns no error without end_time', () => {
    render(<LastScanned end_time={undefined} />);

    expect(screen.getByText('Never')).toBeInTheDocument();
  });
});

describe('lastScanned helper function', () => {
  it('returns a Date object for valid date string', () => {
    const dateString = '2018-03-16T03:44:05.923774Z';
    const result = lastScanned(dateString);
    const date = new Date(dateString);
    expect(result).toBeInstanceOf(Date);
    expect(result).toEqual(date);
  });

  it('returns "Never" for invalid date string', () => {
    expect(lastScanned(null)).toBe('Never');
    expect(lastScanned(undefined)).toBe('Never');
    expect(lastScanned('invalid-date')).toBe('Never');
  });
});
