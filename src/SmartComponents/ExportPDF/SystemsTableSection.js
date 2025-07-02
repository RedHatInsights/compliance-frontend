import React from 'react';
import PropTypes from 'prop-types';
import {
  global_palette_red_100,
  global_BackgroundColor_200,
  global_FontSize_lg,
  global_FontSize_md,
  global_spacer_sm,
  global_spacer_xs,
} from '@patternfly/react-tokens';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { Text } from '@patternfly/react-core';

const SystemsTableSection = ({ sectionTitle, systemsData }) => {
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
        backgroundColor: global_BackgroundColor_200.value,
      };
      return (
        <Tr key={`${system.id}`} style={isOddRow ? customStyle : {}}>
          <Td
            style={{
              fontSize: global_FontSize_md.value,
              paddingLeft: global_spacer_xs.value,
            }}
            key={system.display_name}
            noPadding={true}
          >
            {system.display_name}
          </Td>
          <Td
            style={{ fontSize: global_FontSize_md.value }}
            key={osMajorVersion}
          >
            RHEL {osMajorVersion}
          </Td>
          <Td
            style={{ fontSize: global_FontSize_md.value }}
            key={system.failed_rule_count}
          >
            {system.failed_rule_count}
          </Td>
          <Td style={{ fontSize: global_FontSize_md.value }} key={system.score}>
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
          backgroundColor: global_BackgroundColor_200.var,
        };
        return (
          <Tr key={`${system.id}`} style={isOddRow ? customStyle : {}}>
            <Td
              style={{
                fontSize: global_FontSize_md.value,
                paddingLeft: global_spacer_xs.value,
              }}
              key={system.display_name}
              noPadding={true}
            >
              {system.display_name}
            </Td>
            <Td
              style={{ fontSize: global_FontSize_md.value }}
              key={osMajorVersion}
            >
              RHEL {osMajorVersion}
            </Td>
            <Td
              style={{ fontSize: global_FontSize_md.value }}
              key={system.security_guide_version || 'N/A'}
            >
              {system.security_guide_version || 'N/A'}
            </Td>
            <Td
              style={{ fontSize: global_FontSize_md.value }}
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
          backgroundColor: global_BackgroundColor_200.var,
        };
        return (
          <Tr key={`${system.id}`} style={isOddRow ? customStyle : {}}>
            <Td
              style={{
                fontSize: global_FontSize_md.value,
                paddingLeft: global_spacer_xs.value,
              }}
              key={system.display_name}
              noPadding={true}
            >
              {system.display_name}
            </Td>
            <Td
              style={{ fontSize: global_FontSize_md.value }}
              key={osMajorVersion}
            >
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
      <Text
        style={{
          color: global_palette_red_100.value,
          fontSize: global_FontSize_lg.value,
          marginBottom: global_spacer_xs.value,
        }}
      >
        {sectionTitle}
      </Text>
      <Table borders={false} variant="compact">
        <Thead noWrap={true}>
          <Tr>
            {headers.map((colHeader, index) => (
              <Th
                style={{
                  fontSize: global_FontSize_md.value,
                  paddingLeft:
                    index === 0
                      ? global_spacer_xs.value
                      : global_spacer_sm.value,
                }}
                key={`header-${index}`}
              >
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
};

export default SystemsTableSection;
