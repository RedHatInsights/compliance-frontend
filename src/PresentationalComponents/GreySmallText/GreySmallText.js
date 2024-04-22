import React from 'react';
import propTypes from 'prop-types';
import { Text, TextVariants } from '@patternfly/react-core';

export const GreySmallText = ({ children }) => (
  <Text
    style={{ color: 'var(--pf-v5-global--Color--200)' }}
    component={TextVariants.small}
  >
    {children}
  </Text>
);

GreySmallText.propTypes = {
  children: propTypes.node,
};

export default GreySmallText;
