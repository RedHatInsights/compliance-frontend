import React from 'react';
import PropTypes from 'prop-types';
import {
  t_color_red_70,
  chart_global_Fill_Color_200,
  chart_global_FontSize_lg,
  chart_global_FontSize_2xl,
  t_global_spacer_xs,
} from '@patternfly/react-tokens';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { Content } from '@patternfly/react-core';
import { capitalizeWord, stringToSentenceCase } from '@/Utilities/helpers';

const TopFailedRulesSection = ({ rulesData }) => {
  return (
    <React.Fragment>
      <Content
        style={{
          color: t_color_red_70.value,
          fontSize: chart_global_FontSize_lg.value,
        }}
      >
        Top failed rules
      </Content>
      <Table borders={false} variant="compact">
        <Thead noWrap={true}>
          <Tr>
            <Th
              style={{
                fontSize: chart_global_FontSize_2xl.value,
                paddingLeft: t_global_spacer_xs.value,
              }}
            >
              ID
            </Th>
            <Th style={{ fontSize: chart_global_FontSize_2xl.value }}>Name</Th>
            <Th style={{ fontSize: chart_global_FontSize_2xl.value }}>
              Severity
            </Th>
            <Th style={{ fontSize: chart_global_FontSize_2xl.value }}>
              Failed systems
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {rulesData.map((item, index) => (
            <Tr
              key={`rule-row-${index}`}
              style={{
                backgroundColor:
                  (index + 1) % 2 && chart_global_Fill_Color_200.value,
                fontSize: chart_global_FontSize_2xl.value,
              }}
            >
              <Td
                style={{
                  fontSize: chart_global_FontSize_2xl.value,
                  paddingLeft: t_global_spacer_xs.value,
                }}
                modifier="nowrap"
              >
                {item.identifier.label}
              </Td>
              <Td style={{ fontSize: chart_global_FontSize_2xl.value }}>
                {stringToSentenceCase(item.title)}
              </Td>
              <Td
                style={{ fontSize: chart_global_FontSize_2xl.value }}
                modifier="nowrap"
              >
                {capitalizeWord(item.severity)}
              </Td>
              <Td
                style={{ fontSize: chart_global_FontSize_2xl.value }}
                modifier="nowrap"
              >
                {item.count}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </React.Fragment>
  );
};

TopFailedRulesSection.propTypes = {
  rulesData: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      identifier: PropTypes.node,
      severity: PropTypes.string,
      count: PropTypes.number,
    }),
  ).isRequired,
};

export default TopFailedRulesSection;
