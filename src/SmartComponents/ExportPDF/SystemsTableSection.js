import React from 'react';
import propTypes from 'prop-types';
import { Text } from '@react-pdf/renderer';
import chart_color_red_100 from '@patternfly/react-tokens/dist/js/chart_color_red_100';
import global_BackgroundColor_200 from '@patternfly/react-tokens/dist/js/global_BackgroundColor_200';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

const SystemsTableSection = ({ sectionTitle, systemsData }) => {
  const commonTableConfig = {
    headers: [
      { value: 'System name' },
      { value: 'OS' },
      { value: 'Failed rules' },
      { value: 'Compliance score' },
    ],
    rowBuilder: (system, isOddRow) => {
      const osMajorVersion = `${system.os_major_version}.${system.os_minor_version}`;
      const customStyle = {
        backgroundColor: global_BackgroundColor_200.var,
      };
      return (
        <Tr
          noPadding={true}
          key={`${system.display_name}`}
          style={isOddRow ? customStyle : {}}
        >
          <Td key={system.display_name}>{system.display_name}</Td>
          <Td key={osMajorVersion}>{osMajorVersion}</Td>
          <Td key={system.failed_rule_count}>{system.failed_rule_count}</Td>
          <Td key={system.score}>{system.score}</Td>
        </Tr>
      );
    },
  };

  const tableConfigurations = {
    'Compliant systems': commonTableConfig,
    'Non-compliant systems': commonTableConfig,
    'Systems with unsupported configuration': {
      headers: [
        { value: 'System name' },
        { value: 'OS' },
        { value: 'Running SSG version' },
        { value: 'Expected SSG version' },
      ],
      rowBuilder: (system, isOddRow) => {
        const osMajorVersion = `${system.os_major_version}.${system.os_minor_version}`;
        const customStyle = {
          backgroundColor: global_BackgroundColor_200.var,
        };
        return (
          <Tr
            noPadding={true}
            key={`${system.display_name}`}
            style={isOddRow ? customStyle : {}}
          >
            <Td key={system.display_name}>{system.display_name}</Td>
            <Td key={osMajorVersion}>{osMajorVersion}</Td>
            <Td key={system.security_guide_version || 'N/A'}>
              {system.security_guide_version || 'N/A'}
            </Td>
            <Td key={system.expected_security_guide_version || 'N/A'}>
              {system.expected_security_guide_version || 'N/A'}
            </Td>
          </Tr>
        );
      },
    },
    'Systems never reported': {
      headers: [{ value: 'System name' }, { value: 'OS' }],
      rowBuilder: (system, isOddRow) => {
        const osMajorVersion = `${system.os_major_version}.${system.os_minor_version}`;
        const customStyle = {
          backgroundColor: global_BackgroundColor_200.var,
        };
        return (
          <Tr
            noPadding={true}
            key={`${system.display_name}`}
            style={isOddRow ? customStyle : {}}
          >
            <Td key={system.display_name}>{system.display_name}</Td>
            <Td key={osMajorVersion}>{osMajorVersion}</Td>
          </Tr>
        );
      },
    },
  };

  const currentConfig = tableConfigurations[sectionTitle];

  const headers = currentConfig.headers;
  const rowBuilder = currentConfig.rowBuilder;

  const rows = systemsData.map((system, idx) => {
    const isOddRow = (idx + 1) % 2;
    return rowBuilder(system, isOddRow);
  });

  return (
    <React.Fragment>
      <Text style={{ color: chart_color_red_100.value }}>{sectionTitle}</Text>
      <Table variant="compact">
        <Thead>
          {headers.map((colHeader, index) => (
            <Th key={`header-${index}`}>{colHeader.value}</Th>
          ))}
        </Thead>
        <Tbody>{rows}</Tbody>
      </Table>
    </React.Fragment>
  );
};

SystemsTableSection.propTypes = {
  sectionTitle: propTypes.string.isRequired,
  systemsData: propTypes.array.isRequired,
};

export default SystemsTableSection;
