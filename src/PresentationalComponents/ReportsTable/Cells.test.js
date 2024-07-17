import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestWrapper from '@/Utilities/TestWrapper';

import {
  Name,
  OperatingSystem,
  CompliantSystems,
  PDFExportDownload,
} from './Cells';

describe('Name', () => {
  it('expect to render without error', () => {
    render(
      <TestWrapper>
        <Name
          {...{
            id: 'ID',
            title: 'NAME',
            type: 'POLICY_TYPE',
            profile_title: 'POLICY_NAME',
          }}
        />
      </TestWrapper>
    );

    expect(screen.getByText('POLICY_NAME')).toBeInTheDocument();
  });
});

describe('OperatingSystem', () => {
  const defaultProps = {
    os_major_version: '7',
  };

  it('expect to render with SSG version', () => {
    render(
      <TestWrapper>
        <OperatingSystem
          {...defaultProps}
          benchmark={{ version: '1.2.3' }}
          policy={null}
          unsupported_system_count={0}
        />
      </TestWrapper>
    );

    expect(screen.getByText('RHEL 7')).toBeInTheDocument();
    expect(screen.getByText('SSG: 1.2.3')).toBeInTheDocument();
  });

  it('expect to render with unsupported warning', () => {
    render(
      <TestWrapper>
        <OperatingSystem
          {...defaultProps}
          benchmark={{ version: '1.2.3' }}
          unsupported_system_count={3}
          policy={null}
        />
      </TestWrapper>
    );

    expect(
      screen.getByLabelText('Unsupported SSG Version warning')
    ).toBeInTheDocument();
  });
});

describe('CompliantSystems', () => {
  const deftaultProps = {
    reported_system_count: 10,
    compliant_system_count: 9,
  };

  it('expect to render with unsupported hosts', () => {
    render(
      <TestWrapper>
        <CompliantSystems {...deftaultProps} unsupported_system_count={42} />
      </TestWrapper>
    );

    expect(screen.getByLabelText('Report chart')).toBeInTheDocument();
  });
});

describe('PDFExportDownload', () => {
  it('expect to render without error', () => {
    render(
      <TestWrapper>
        <PDFExportDownload id="ID1" />
      </TestWrapper>
    );

    expect(
      screen.getByLabelText('Reports PDF download link')
    ).toBeInTheDocument();
  });
});
