import React from 'react';
import propTypes from 'prop-types';
import { Content, Icon } from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';

const WarningText = ({ children }) => (
  <React.Fragment>
    <Icon status="warning">
      <ExclamationTriangleIcon />
    </Icon>
    <Content component="span" className="ins-c-warning-text">
      &nbsp;{children}
    </Content>
  </React.Fragment>
);

WarningText.propTypes = {
  children: propTypes.node,
};

export default WarningText;
