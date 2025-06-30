import React from 'react';
import PropTypes from 'prop-types';
import {
  global_palette_red_100,
  global_BackgroundColor_200,
  global_FontSize_lg,
  global_FontSize_md,
  global_spacer_xs,
} from '@patternfly/react-tokens';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { Text } from '@patternfly/react-core';
import { capitalizeWord, stringToSentenceCase } from '@/Utilities/helpers';

const TopFailedRulesSection = ({ rulesData }) => {
  return (
    <React.Fragment>
      <Text
        style={{
          color: global_palette_red_100.value,
          fontSize: global_FontSize_lg.value,
        }}
      >
        Top failed rules
      </Text>
      <Table borders={false} variant="compact">
        <Thead noWrap={true}>
          <Tr>
            <Th
              style={{
                fontSize: global_FontSize_md.value,
                paddingLeft: global_spacer_xs.value,
              }}
            >
              ID
            </Th>
            <Th style={{ fontSize: global_FontSize_md.value }}>Name</Th>
            <Th style={{ fontSize: global_FontSize_md.value }}>Severity</Th>
            <Th style={{ fontSize: global_FontSize_md.value }}>
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
                  (index + 1) % 2 && global_BackgroundColor_200.value,
                fontSize: global_FontSize_md.value,
              }}
            >
              <Td
                style={{
                  fontSize: global_FontSize_md.value,
                  paddingLeft: global_spacer_xs.value,
                }}
                modifier="nowrap"
              >
                {item.identifier.label}
              </Td>
              <Td style={{ fontSize: global_FontSize_md.value }}>
                {stringToSentenceCase(item.title)}
              </Td>
              <Td
                style={{ fontSize: global_FontSize_md.value }}
                modifier="nowrap"
              >
                {capitalizeWord(item.severity)}
              </Td>
              <Td
                style={{ fontSize: global_FontSize_md.value }}
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
  rulesData: PropTypes.object,
};

export default TopFailedRulesSection;
