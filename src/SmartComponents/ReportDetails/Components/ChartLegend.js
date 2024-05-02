import React from 'react';
import propTypes from 'prop-types';
import { List, ListItem, Tooltip, Popover, Icon } from '@patternfly/react-core';
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
    {legendData.map(({ name, symbol, tooltip, popover }, index) => (
      <ListItem
        key={index}
        icon={<ChartIcon color={symbol?.fill} />}
        style={{ verticalAlign: 'middle' }}
      >
        {name}
        {tooltip && (
          <Tooltip content={<> {tooltip} </>}>
            <span>
              &nbsp;
              <Icon className="grey-icon">
                <OutlinedQuestionCircleIcon />
              </Icon>
            </span>
          </Tooltip>
        )}
        {popover &&
          (({ title = '', content = '', footer = '' }) => (
            <Popover
              maxWidth="25rem"
              headerContent={title}
              bodyContent={content}
              footerContent={footer}
            >
              <span>
                &nbsp;
                <Icon
                  className="grey-icon"
                  style={{ cursor: 'pointer', marginTop: '3px' }}
                >
                  <OutlinedQuestionCircleIcon />
                </Icon>
              </span>
            </Popover>
          ))(popover)}
      </ListItem>
    ))}
  </List>
);

ChartLegend.propTypes = {
  legendData: propTypes.array,
};

export default ChartLegend;
