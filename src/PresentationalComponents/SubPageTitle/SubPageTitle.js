import React from 'react';
import propTypes from 'prop-types';
import { Title } from '@patternfly/react-core';

const SubPageTitle = ({ children }) => (
  <Title
    headingLevel="h4"
    style={{
      color: 'var(--pf-t--global--text--color--200)',
      lineHeight: '2rem',
    }}
  >
    {children}
  </Title>
);

SubPageTitle.propTypes = {
  children: propTypes.node,
};

export default SubPageTitle;
