import React from 'react';
import { Label, Spinner, TabTitleText } from '@patternfly/react-core';
import propTypes from 'prop-types';

const TabTitleWithData = ({ text, data, isLoading, color }) => (
  <TabTitleText>
    <span className="pf-v5-u-mr-sm">{text}</span>
    {isLoading ? (
      <Spinner size="md" />
    ) : data ? (
      <Label color={color} isCompact>
        {data}
      </Label>
    ) : (
      <></>
    )}
  </TabTitleText>
);

TabTitleWithData.propTypes = {
  text: propTypes.string.isRequired,
  data: propTypes.object,
  isLoading: propTypes.bool,
  color: propTypes.string,
};

export default TabTitleWithData;
