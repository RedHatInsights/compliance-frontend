import React from 'react';
import PropTypes from 'prop-types';
import { t_global_background_color_secondary_default } from '@patternfly/react-tokens';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { Content } from '@patternfly/react-core';

const SystemsTableSection = ({ sectionTitle, systemsData, styles }) => {
  const commonTableConfig = {
    headers: [
      { value: 'Name' },
      { value: 'OS' },
      { value: 'Failed rules' },
      { value: 'Compliance score' },
    ],
    rowBuilder: (system, isOddRow) => {
      const osMajorVersion = `${system.os_major_version}.${system.os_minor_version}`;
      const customStyle = {
        backgroundColor: t_global_background_color_secondary_default.value,
      };
      return (
        <Tr key={`${system.id}`} style={isOddRow ? customStyle : {}}>
          <Td style={styles.row} key={system.display_name} noPadding={true}>
            {system.display_name}
          </Td>
          <Td style={styles.row} key={osMajorVersion}>
            RHEL {osMajorVersion}
          </Td>
          <Td style={styles.row} key={system.failed_rule_count}>
            {system.failed_rule_count}
          </Td>
          <Td style={styles.row} key={system.score}>
            {system.score}%
          </Td>
        </Tr>
      );
    },
  };

  const tableConfigurations = {
    'Compliant systems': commonTableConfig,
    'Non-compliant systems': commonTableConfig,
    'Systems with unsupported configuration': {
      headers: [
        { value: 'Name' },
        { value: 'OS' },
        { value: 'Current SSG' },
        { value: 'Expected SSG' },
      ],
      rowBuilder: (system, isOddRow) => {
        const osMajorVersion = `${system.os_major_version}.${system.os_minor_version}`;
        const customStyle = {
          backgroundColor: t_global_background_color_secondary_default.value,
        };
        return (
          <Tr key={`${system.id}`} style={isOddRow ? customStyle : {}}>
            <Td style={styles.row} key={system.display_name} noPadding={true}>
              {system.display_name}
            </Td>
            <Td style={styles.row} key={osMajorVersion}>
              RHEL {osMajorVersion}
            </Td>
            <Td style={styles.row} key={system.security_guide_version || 'N/A'}>
              {system.security_guide_version || 'N/A'}
            </Td>
            <Td
              style={styles.row}
              key={system.expected_security_guide_version || 'N/A'}
            >
              {system.expected_security_guide_version || 'N/A'}
            </Td>
          </Tr>
        );
      },
    },
    'Systems never reported': {
      headers: [{ value: 'Name' }, { value: 'OS' }],
      rowBuilder: (system, isOddRow) => {
        const osMajorVersion = `${system.os_major_version}.${system.os_minor_version}`;
        const customStyle = {
          backgroundColor: t_global_background_color_secondary_default.value,
        };
        return (
          <Tr key={`${system.id}`} style={isOddRow ? customStyle : {}}>
            <Td style={styles.row} key={system.display_name} noPadding={true}>
              {system.display_name}
            </Td>
            <Td style={styles.row} key={osMajorVersion}>
              RHEL {osMajorVersion}
            </Td>
          </Tr>
        );
      },
    },
  };

  const currentConfig = tableConfigurations[sectionTitle];

  const { headers } = currentConfig;
  const { rowBuilder } = currentConfig;

  const rows = systemsData.map((system, idx) => {
    const isOddRow = (idx + 1) % 2;
    return rowBuilder(system, isOddRow);
  });

  return (
    <React.Fragment>
      <Content style={styles.sectionHeader}>{sectionTitle}</Content>
      <Table borders={false} style={{ width: '100%' }}>
        <Thead>
          <Tr>
            {headers.map((colHeader, index) => (
              <Th style={styles.noWrapHeader} key={`header-${index}`}>
                {colHeader.value}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>{rows}</Tbody>
      </Table>
    </React.Fragment>
  );
};

SystemsTableSection.propTypes = {
  sectionTitle: PropTypes.string.isRequired,
  systemsData: PropTypes.array.isRequired,
  styles: PropTypes.object.isRequired,
};

export default SystemsTableSection;
