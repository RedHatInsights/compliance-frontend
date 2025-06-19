import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestWrapper from '@/Utilities/TestWrapper';

import {
  Name,
  OperatingSystem,
  CompliantSystems,
  PDFExportDownload,
} from './Cells';

describe('ReportsTable Cells', () => {
  it('expect to render Name cell', () => {
    const defaultProps = {
      id: '123',
      title: 'Foo',
      profile_title: 'Foo profile title',
      compliance_threshold: 50,
      os_major_version: 8,
      business_objective: 'foo',
    };

    render(
      <TestWrapper>
        <Name {...defaultProps} />
      </TestWrapper>,
    );

    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    const link = screen.getByRole('link', { name: defaultProps.title });
    expect(link).toHaveAttribute(
      'href',
      expect.stringContaining(`/reports/${defaultProps.id}`),
    );
  });

  it('expect to render OperatingSystem cell', () => {
    const defaultProps = {
      os_major_version: '7',
    };

    render(
      <TestWrapper>
        <OperatingSystem {...defaultProps} />
      </TestWrapper>,
    );
    expect(
      screen.getByText(`RHEL ${defaultProps.os_major_version}`),
    ).toBeInTheDocument();
  });

  it('expect to render CompliantSystems cell', () => {
    const defaultProps = {
      assigned_system_count: 10,
      reported_system_count: 7,
      unsupported_system_count: 2,
      compliant_system_count: 4,
      percent_compliant: 40,
    };

    render(
      <TestWrapper>
        <CompliantSystems {...defaultProps} />
      </TestWrapper>,
    );

    expect(screen.getByLabelText('Report chart')).toBeInTheDocument();
    expect(screen.getByText('40%')).toBeInTheDocument();
  });

  it('expect to render PDFExportDownload cell', () => {
    render(
      <TestWrapper>
        <PDFExportDownload id="123" />
      </TestWrapper>,
    );

    expect(
      screen.getByLabelText('Reports PDF download link'),
    ).toBeInTheDocument();
  });
});
