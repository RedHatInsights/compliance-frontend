import React from 'react';
import propTypes from 'prop-types';
import { List, ListItem, Tooltip } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';

const ChartIcon = ({ color = '#FFFFFF' }) => (
  <span
    style={{
      width: '10px',
      height: '10px',
      display: 'inline-block',
      background: color,
    }}
  >
    &nbsp;
  </span>
);

ChartIcon.propTypes = {
  color: propTypes.string,
};

const ChartLegend = ({ legendData = [] }) => (
  <List>
    {legendData.map(({ name, symbol, tooltip }, index) => (
      <ListItem
        key={index}
        icon={<ChartIcon color={symbol?.fill} />}
        style={{ verticalAlign: 'middle', display: 'inline-block' }}
      >
        {name}
        {tooltip && (
          <Tooltip content={<> {tooltip} </>}>
            <span>
              &nbsp;
              <OutlinedQuestionCircleIcon className="grey-icon" />
            </span>
          </Tooltip>
        )}
      </ListItem>
    ))}
  </List>
);

ChartLegend.propTypes = {
  legendData: propTypes.array,
};

export default ChartLegend;
