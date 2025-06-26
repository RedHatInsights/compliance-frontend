import PropTypes from 'prop-types';
import React from 'react';
import { Text } from '@react-pdf/renderer';
import chart_color_red_100 from '@patternfly/react-tokens/dist/js/chart_color_red_100';
import global_BackgroundColor_150 from '@patternfly/react-tokens/dist/js/global_BackgroundColor_150';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

const TopFailedRulesSection = ({ rulesData }) => {
  return (
    <React.Fragment>
      <Text style={{ color: chart_color_red_100.value }}>Top failed rules</Text>
      <Table variant="compact">
        <Thead noWrap={true}>
          <Tr>
            <Th>Rule name</Th>
            <Th>ID</Th>
            <Th>Severity</Th>
            <Th>Failed systems</Th>
          </Tr>
        </Thead>
        <Tbody>
          {rulesData.map((item, index) => (
            <Tr
              key={`rule-row-${index}`}
              style={{
                backgroundColor:
                  (index + 1) % 2 && global_BackgroundColor_150.var,
                fontSize: '12px',
              }}
            >
              <Td style={{ fontSize: '12px' }}>{item.title}</Td>
              <Td style={{ fontSize: '12px' }} modifier="nowrap">
                {item.identifier.label}
              </Td>
              <Td style={{ fontSize: '12px' }} modifier="nowrap">
                {item.severity}
              </Td>
              <Td style={{ fontSize: '12px' }} modifier="nowrap">
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
  rulesData: PropTypes.object,
};

export default TopFailedRulesSection;
