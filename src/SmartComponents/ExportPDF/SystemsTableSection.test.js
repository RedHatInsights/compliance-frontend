import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import SystemsTableSection from './SystemsTableSection';

describe('SystemsTableSection', () => {
  const mockCompliantSystems = [
    {
      id: 'sys1',
      display_name: 'system-alpha.example.com',
      os_major_version: 8,
      os_minor_version: 1,
      failed_rule_count: 0,
      score: 99,
    },
    {
      id: 'sys2',
      display_name: 'system-beta.example.com',
      os_major_version: 9,
      os_minor_version: 0,
      failed_rule_count: 1,
      score: 98,
    },
  ];

  const mockNonCompliantSystems = [
    {
      id: 'sys3',
      display_name: 'system-gamma.example.com',
      os_major_version: 8,
      os_minor_version: 2,
      failed_rule_count: 5,
      score: 75,
    },
    {
      id: 'sys4',
      display_name: 'system-delta.example.com',
      os_major_version: 7,
      os_minor_version: 9,
      failed_rule_count: 12,
      score: 50,
    },
  ];

  const mockUnsupportedSystems = [
    {
      id: 'sys5',
      display_name: 'unsupported-sys-1.example.com',
      os_major_version: 8,
      os_minor_version: 0,
      security_guide_version: '0.1.60',
      expected_security_guide_version: '0.1.61',
    },
    {
      id: 'sys6',
      display_name: 'unsupported-sys-2.example.com',
      os_major_version: 8,
      os_minor_version: 1,
      security_guide_version: '0.1.49',
      expected_security_guide_version: null,
    },
  ];

  const mockNeverReportedSystems = [
    {
      id: 'sys7',
      display_name: 'never-reported-1.example.com',
      os_major_version: 8,
      os_minor_version: 1,
    },
  ];

  it('renders no table rows when rulesData is empty', () => {
    render(
      <SystemsTableSection sectionTitle="Compliant systems" systemsData={[]} />,
    );
    const rows = screen.queryAllByRole('row');
    expect(rows).toHaveLength(1);
  });

  [
    { title: 'Compliant systems', data: mockCompliantSystems },
    { title: 'Non-compliant systems', data: mockNonCompliantSystems },
  ].forEach(({ title, data }) => {
    describe(`"${title}" are displayed correctly in the table`, () => {
      it('renders system data rows correctly', () => {
        render(<SystemsTableSection sectionTitle={title} systemsData={data} />);

        expect(
          screen.getByRole('columnheader', { name: 'Name' }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole('columnheader', { name: 'OS' }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole('columnheader', { name: 'Failed rules' }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole('columnheader', { name: 'Compliance score' }),
        ).toBeInTheDocument();

        expect(screen.getAllByRole('row')).toHaveLength(data.length + 1);

        data.forEach((system) => {
          expect(screen.getByText(system.display_name)).toBeInTheDocument();
          expect(
            screen.getByText(
              `RHEL ${system.os_major_version}.${system.os_minor_version}`,
            ),
          ).toBeInTheDocument();
          expect(
            screen.getByText(system.failed_rule_count),
          ).toBeInTheDocument();
          expect(screen.getByText(`${system.score}%`)).toBeInTheDocument();
        });
      });
    });
  });

  describe('Unsupported systems are displayed correctly in the table', () => {
    it('renders unsupported system data rows correctly, including N/A for missing SSG versions', () => {
      render(
        <SystemsTableSection
          sectionTitle="Systems with unsupported configuration"
          systemsData={mockUnsupportedSystems}
        />,
      );

      expect(
        screen.getByRole('columnheader', { name: 'Name' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('columnheader', { name: 'OS' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('columnheader', { name: 'Current SSG' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('columnheader', { name: 'Expected SSG' }),
      ).toBeInTheDocument();

      expect(screen.getAllByRole('row')).toHaveLength(
        mockUnsupportedSystems.length + 1,
      );

      mockUnsupportedSystems.forEach((system) => {
        expect(screen.getByText(system.display_name)).toBeInTheDocument();
        expect(
          screen.getByText(
            `RHEL ${system.os_major_version}.${system.os_minor_version}`,
          ),
        ).toBeInTheDocument();
        expect(
          screen.getByText(system.security_guide_version),
        ).toBeInTheDocument();
        expect(
          screen.getByText(
            system.expected_security_guide_version === null
              ? 'N/A'
              : system.expected_security_guide_version,
          ),
        ).toBeInTheDocument();
      });
    });
  });

  describe('Never reported systems are displayed correctly in the table', () => {
    it('renders never reported system data rows correctly', () => {
      render(
        <SystemsTableSection
          sectionTitle="Systems never reported"
          systemsData={mockNeverReportedSystems}
        />,
      );
      expect(
        screen.getByRole('columnheader', { name: 'Name' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('columnheader', { name: 'OS' }),
      ).toBeInTheDocument();

      // Check number of rows (+1 for header)
      expect(screen.getAllByRole('row')).toHaveLength(
        mockNeverReportedSystems.length + 1,
      );

      // Check content for each system
      expect(
        screen.getByText(mockNeverReportedSystems[0].display_name),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          `RHEL ${mockNeverReportedSystems[0].os_major_version}.${mockNeverReportedSystems[0].os_minor_version}`,
        ),
      ).toBeInTheDocument();
    });
  });
});
