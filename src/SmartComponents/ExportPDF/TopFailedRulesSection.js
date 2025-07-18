import React from 'react';
import PropTypes from 'prop-types';
import {
  t_global_background_color_secondary_default,
  t_global_font_size_sm,
} from '@patternfly/react-tokens';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { Content } from '@patternfly/react-core';
import { capitalizeWord, stringToSentenceCase } from '@/Utilities/helpers';

const TopFailedRulesSection = ({ rulesData, styles }) => {
  return (
    <React.Fragment>
      <Content style={styles.sectionHeader}>Top failed rules</Content>
      <Table borders={false} style={{ width: '100%' }}>
        <Thead>
          <Tr>
            <Th style={styles.header}>ID</Th>
            <Th style={styles.header}>Name</Th>
            <Th style={styles.header}>Severity</Th>
            <Th style={styles.noWrapHeader}>Failed systems</Th>
          </Tr>
        </Thead>
        <Tbody>
          {rulesData.map((item, index) => (
            <Tr
              key={`rule-row-${index}`}
              style={{
                backgroundColor:
                  (index + 1) % 2 &&
                  t_global_background_color_secondary_default.value,
                fontSize: t_global_font_size_sm.value,
              }}
            >
              <Td style={styles.noWrapRow}>{item.identifier.label}</Td>
              <Td style={styles.row}>{stringToSentenceCase(item.title)}</Td>
              <Td style={styles.row}>{capitalizeWord(item.severity)}</Td>
              <Td style={styles.row}>{item.count}</Td>
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
  styles: PropTypes.object.isRequired,
};

export default TopFailedRulesSection;
