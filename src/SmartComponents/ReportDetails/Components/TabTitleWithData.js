import React from 'react';
import { Label, Spinner, TabTitleText } from '@patternfly/react-core';
import propTypes from 'prop-types';
import { getTerm } from '@/Utilities/helpers';

const TabTitleWithData = ({ text, data, isLoading, color }) => (
  <TabTitleText>
    <span className="pf-v6-u-mr-sm">{text}</span>
    {isLoading ? (
      <Spinner size="md" />
    ) : data ? (
      <Label color={color} isCompact>
        {data} {getTerm('system', { plural: Number(data) !== 1 })}
      </Label>
    ) : (
      <></>
    )}
  </TabTitleText>
);

TabTitleWithData.propTypes = {
  text: propTypes.string.isRequired,
  data: propTypes.number,
  isLoading: propTypes.bool,
  color: propTypes.string,
};

export default TabTitleWithData;
