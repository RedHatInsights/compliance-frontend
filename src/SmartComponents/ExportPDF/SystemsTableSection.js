import React from 'react';
import PropTypes from 'prop-types';
import {
  t_color_red_70,
  chart_global_Fill_Color_200,
  chart_global_FontSize_lg,
  chart_global_FontSize_2xl,
  t_global_spacer_sm,
  t_global_spacer_xs,
} from '@patternfly/react-tokens';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { Content } from '@patternfly/react-core';

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
        backgroundColor: chart_global_Fill_Color_200.value,
      };
      return (
        <Tr key={`${system.id}`} style={isOddRow ? customStyle : {}}>
          <Td
            style={{
              fontSize: chart_global_FontSize_2xl.value,
              paddingLeft: t_global_spacer_xs.value,
            }}
            key={system.display_name}
            noPadding={true}
          >
            {system.display_name}
          </Td>
          <Td
            style={{ fontSize: chart_global_FontSize_2xl.value }}
            key={osMajorVersion}
          >
            RHEL {osMajorVersion}
          </Td>
          <Td
            style={{ fontSize: chart_global_FontSize_2xl.value }}
            key={system.failed_rule_count}
          >
            {system.failed_rule_count}
          </Td>
          <Td
            style={{ fontSize: chart_global_FontSize_2xl.value }}
            key={system.score}
          >
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
          backgroundColor: chart_global_Fill_Color_200.var,
        };
        return (
          <Tr key={`${system.id}`} style={isOddRow ? customStyle : {}}>
            <Td
              style={{
                fontSize: chart_global_FontSize_2xl.value,
                paddingLeft: t_global_spacer_xs.value,
              }}
              key={system.display_name}
              noPadding={true}
            >
              {system.display_name}
            </Td>
            <Td
              style={{ fontSize: chart_global_FontSize_2xl.value }}
              key={osMajorVersion}
            >
              RHEL {osMajorVersion}
            </Td>
            <Td
              style={{ fontSize: chart_global_FontSize_2xl.value }}
              key={system.security_guide_version || 'N/A'}
            >
              {system.security_guide_version || 'N/A'}
            </Td>
            <Td
              style={{ fontSize: chart_global_FontSize_2xl.value }}
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
          backgroundColor: chart_global_Fill_Color_200.var,
        };
        return (
          <Tr key={`${system.id}`} style={isOddRow ? customStyle : {}}>
            <Td
              style={{
                fontSize: chart_global_FontSize_2xl.value,
                paddingLeft: t_global_spacer_xs.value,
              }}
              key={system.display_name}
              noPadding={true}
            >
              {system.display_name}
            </Td>
            <Td
              style={{ fontSize: chart_global_FontSize_2xl.value }}
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
      <Content
        style={{
          color: t_color_red_70.value,
          fontSize: chart_global_FontSize_lg.value,
          marginBottom: t_global_spacer_xs.value,
        }}
      >
        {sectionTitle}
      </Content>
      <Table borders={false} variant="compact">
        <Thead noWrap={true}>
          <Tr>
            {headers.map((colHeader, index) => (
              <Th
                style={{
                  fontSize: chart_global_FontSize_2xl.value,
                  paddingLeft:
                    index === 0
                      ? t_global_spacer_xs.value
                      : t_global_spacer_sm.value,
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
