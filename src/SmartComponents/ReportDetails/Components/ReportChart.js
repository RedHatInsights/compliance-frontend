import React from 'react';
import propTypes from 'prop-types';
import { Grid, GridItem } from '@patternfly/react-core';
import { ChartDonut } from '@patternfly/react-charts';
import '@/Charts.scss';
import ChartLegend from './ChartLegend';
import useDonutChart from './hooks/useDonutChart';

const ReportChart = ({ profile = {}, hasLegend = true, chartClass }) => {
  const { chartProps, legendData } = useDonutChart(profile);

  return (
    <Grid aria-label="Report chart" className={chartClass}>
      <GridItem span={hasLegend ? 6 : 12}>
        <ChartDonut {...chartProps} />
      </GridItem>
      {hasLegend ? (
        <GridItem
          span={6}
          className="pf-v5-u-display-flex pf-v5-u-align-items-center"
          style={{
            fontSize: '.85em',
            height: '100%',
          }}
        >
          <ChartLegend legendData={legendData} />
        </GridItem>
      ) : null}
    </Grid>
  );
};

ReportChart.propTypes = {
  profile: propTypes.object,
  hasLegend: propTypes.bool,
  chartClass: propTypes.string,
};

export default ReportChart;
