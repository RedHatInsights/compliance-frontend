import React from 'react';
import propTypes from 'prop-types';
import { Content, ContentVariants } from '@patternfly/react-core';
import { t_global_text_color_subtle } from '@patternfly/react-tokens';

export const GreySmallText = ({ children }) => (
  <Content
    style={{
      color: t_global_text_color_subtle.var,
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
