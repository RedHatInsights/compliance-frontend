import React from 'react';
import propTypes from 'prop-types';
import { Content } from '@patternfly/react-core';

const PolicyTypeDetailsRow = ({ item: { description }, key }) => {
  return (
    <Content
      component="p"
      key={key}
      style={{ margin: 'var(--pf-t--global--spacer--lg)' }}
    >
      {description}
    </Content>
  );
};

PolicyTypeDetailsRow.propTypes = {
  item: propTypes.object,
  key: propTypes.string,
};

export default PolicyTypeDetailsRow;
