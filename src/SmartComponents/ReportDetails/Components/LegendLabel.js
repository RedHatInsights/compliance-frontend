import React from 'react';
import propTypes from 'prop-types';
import { ChartLabel } from '@patternfly/react-charts';
import { Tooltip } from '@patternfly/react-core';

const LegendLabel = ({ datum, ...rest }) =>
  datum.tooltip ? (
    <Tooltip content={datum.tooltip}>
      <ChartLabel {...rest} />
    </Tooltip>
  ) : (
    <ChartLabel {...rest} />
  );

LegendLabel.propTypes = {
  datum: propTypes.object,
};

export default LegendLabel;
