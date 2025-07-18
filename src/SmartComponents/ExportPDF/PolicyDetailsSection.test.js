import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import PolicyDetailsSection from './PolicyDetailsSection';
import { fixedPercentage } from 'Utilities/TextHelper';
import { styles } from './ReportPDFBuild';

describe('PolicyDetailsSection', () => {
  const baseReportData = {
    business_objective: 'My cool business objective',
    compliance_threshold: 50.5,
    os_major_version: 8,
    profile_title: 'CIS Red Hat Enterprise Linux 8 Benchmark',
    percent_compliant: 75.3,
    assigned_system_count: 10,
    compliant_system_count: 5,
    unsupported_system_count: 2,
    reported_system_count: 8,
  };

  it.only('should render policy details and donut chart with all data', () => {
    render(
      <PolicyDetailsSection reportData={baseReportData} styles={styles} />,
    );

    expect(screen.getByText('Policy details')).toBeInTheDocument();

    expect(screen.getByText('Policy type')).toBeInTheDocument();
    expect(screen.getByText(baseReportData.profile_title)).toBeInTheDocument();

    expect(screen.getByText('Operating system')).toBeInTheDocument();
    expect(
      screen.getByText(`RHEL ${baseReportData.os_major_version}`),
    ).toBeInTheDocument();

    expect(screen.getByText('Compliance threshold')).toBeInTheDocument();
    expect(screen.getByText(fixedPercentage(50.5))).toBeInTheDocument();

    expect(screen.getByText('Business objective')).toBeInTheDocument();
    expect(
      screen.getByText(baseReportData.business_objective),
    ).toBeInTheDocument();

    expect(screen.getByText('75%')).toBeInTheDocument();

    const nonCompliantSystemCount =
      baseReportData.reported_system_count -
      baseReportData.compliant_system_count -
      baseReportData.unsupported_system_count;
    const neverReportingSystemCount =
      baseReportData.assigned_system_count -
      baseReportData.reported_system_count;
    expect(
      screen.getByText(
        `Compliant systems: ${baseReportData.compliant_system_count}`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Non compliant systems: ${nonCompliantSystemCount}`),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        `Unsupported systems: ${baseReportData.unsupported_system_count}`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Never reported systems: ${neverReportingSystemCount}`),
    ).toBeInTheDocument();
  });

  it('should display "--" when business_objective is null', () => {
    const reportDataNullObjective = {
      ...baseReportData,
      business_objective: null,
    };
    render(
      <PolicyDetailsSection
        reportData={reportDataNullObjective}
        styles={styles}
      />,
    );

    expect(screen.getByText('Business objective')).toBeInTheDocument();
    expect(screen.getByText('--')).toBeInTheDocument();
  });
});
