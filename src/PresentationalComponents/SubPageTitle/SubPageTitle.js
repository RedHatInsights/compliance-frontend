import React from 'react';
import propTypes from 'prop-types';
import { Content } from '@patternfly/react-core';

const SubPageTitle = ({ children }) => (
  <Content
    component="h2"
    style={{
      color: 'var(--pf-t--global--color--status--danger--100)',
      lineHeight: '2rem',
    }}
  >
    {children}
  </Content>
);

SubPageTitle.propTypes = {
  children: propTypes.node,
};

export default SubPageTitle;
