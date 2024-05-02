import React from 'react';
import propTypes from 'prop-types';
import { Text } from '@patternfly/react-core';

const SubPageTitle = ({ children }) => (
  <Text
    component="h2"
    style={{
      color: 'var(--pf-v5-global--Color--200)',
      lineHeight: '2rem',
    }}
  >
    {children}
  </Text>
);

SubPageTitle.propTypes = {
  children: propTypes.node,
};

export default SubPageTitle;
