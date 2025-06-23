import React from 'react';
import propTypes from 'prop-types';
import { Content, ContentVariants } from '@patternfly/react-core';

export const GreySmallText = ({ children }) => (
  <Content
    style={{
      color: 'var(--pf-t--global--text--color--200)',
    }}
    component={ContentVariants.small}
  >
    {children}
  </Content>
);

GreySmallText.propTypes = {
  children: propTypes.node,
};

export default GreySmallText;
