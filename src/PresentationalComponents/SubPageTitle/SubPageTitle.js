import React from 'react';
import propTypes from 'prop-types';
import { Title } from '@patternfly/react-core';
import { t_global_text_color_subtle } from '@patternfly/react-tokens';

const SubPageTitle = ({ children }) => (
  <Title
    headingLevel="h4"
    style={{
      color: t_global_text_color_subtle.var,
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
