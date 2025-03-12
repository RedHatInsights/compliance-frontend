import React from 'react';
import propTypes from 'prop-types';
import { Text } from '@patternfly/react-core';

const PolicyTypeDetailsRow = ({ item: { description }, key }) => {
  return (
    <Text key={key} style={{ margin: 'var(--pf-v5-global--spacer--lg) 0' }}>
      {description}
    </Text>
  );
};

PolicyTypeDetailsRow.propTypes = {
  item: propTypes.object,
  key: propTypes.string,
};

export default PolicyTypeDetailsRow;
