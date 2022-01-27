import React from 'react';
import propTypes from 'prop-types';
import { Grid, GridItem } from '@patternfly/react-core';
import { ChartDonut } from '@patternfly/react-charts';
import '@/Charts.scss';
import ChartLegend from './ChartLegend';
import useDonutChart from './hooks/useDonutChart';

const ReportChart = ({ profile = {} }) => {
  const { chartProps, legendData } = useDonutChart(profile);

  return (
    <Grid className="chart-container">
      <GridItem span={6}>
        <ChartDonut {...chartProps} />
      </GridItem>
      <GridItem
        span={6}
        className="pf-u-display-flex pf-u-align-items-center"
        style={{
          fontSize: '.85em',
          height: '100%',
        }}
      >
        <ChartLegend legendData={legendData} />
      </GridItem>
    </Grid>
  );
};

ReportChart.propTypes = {
  profile: propTypes.object,
};

export default ReportChart;
