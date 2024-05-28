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
} from './Cells';
import { systems } from '@/__fixtures__/systems.js';
const testSystem = systems[0].node;

describe('Name', () => {
  it('returns the name', () => {
    render(<Name {...testSystem} />);

    expect(screen.getByText(testSystem.name)).toBeInTheDocument();
  });
});

describe('SSGVersions', () => {
  it('returns', () => {
    render(<SSGVersions {...testSystem} />);

    expect(screen.getByText(/0\.14\.3/)).toBeInTheDocument();
  });

  it('returns no error without testResultProfiles', () => {
    render(<SSGVersions {...testSystem} testResultProfiles={[]} />);
    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });
});

describe('Policies', () => {
  it('returns the system policies', () => {
    render(<Policies {...testSystem} />);

    expect(screen.getByText('HIPAA Policy')).toBeInTheDocument();
  });
});

describe('FailedRules', () => {
  it('returns the amount of failed rules', () => {
    render(
      <TestWrapper>
        <FailedRules {...testSystem} />
      </TestWrapper>
    );

    expect(screen.getByText('28')).toBeInTheDocument();
  });

  it('returns no error without testResultProfiles', () => {
    render(
      <TestWrapper>
        <FailedRules {...testSystem} testResultProfiles={[]} />
      </TestWrapper>
    );

    expect(screen.getByText('N/A')).toBeInTheDocument();
  });
});

describe('ComplianceScore', () => {
  it('returns', () => {
    render(<ComplianceScore {...testSystem} />);

    expect(screen.getByText('40%')).toBeInTheDocument();
  });

  it('returns no error without testResultProfiles', () => {
    render(<ComplianceScore {...testSystem} testResultProfiles={[]} />);

    expect(screen.getByText('N/A')).toBeInTheDocument();
  });
});

describe('LastScanned', () => {
  it('returns the relative date the system was last scanned', () => {
    render(<LastScanned {...testSystem} />);

    expect(screen.getByText('5 years ago')).toBeInTheDocument();
  });

  it('returns NEVER', () => {
    render(<LastScanned {...testSystem} testResultProfiles={undefined} />);

    expect(screen.getByText('Never')).toBeInTheDocument();
  });

  it('returns no error without testResultProfiles', () => {
    render(<LastScanned {...testSystem} testResultProfiles={[]} />);

    expect(screen.getByText('Never')).toBeInTheDocument();
  });
});
