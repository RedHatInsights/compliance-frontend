import React from 'react';
import propTypes from 'prop-types';

import black300 from '@patternfly/react-tokens/dist/esm/global_palette_black_300';
import blue200 from '@patternfly/react-tokens/dist/esm/chart_color_blue_200';
import blue300 from '@patternfly/react-tokens/dist/esm/chart_color_blue_300';
import chart_color_black_200 from '@patternfly/react-tokens/dist/esm/chart_color_black_200';
import chart_color_gold_300 from '@patternfly/react-tokens/dist/esm/chart_color_gold_300';

import {
  ChartDonut,
  ChartThemeVariant,
  ChartLegend,
} from '@patternfly/react-charts';
import { fixedPercentage, pluralize } from 'Utilities/TextHelper';

import '@/Charts.scss';
import LegendLabel from './LegendLabel';

const ReportChart = ({ profile }) => {
  const {
    compliantHostCount,
    testResultHostCount,
    unsupportedHostCount,
    totalHostCount,
  } = profile;
  const notReportingHostCount =
    totalHostCount - unsupportedHostCount - testResultHostCount;
  const donutId = profile.name.replace(/ /g, '');
  const donutValues = [
    { x: 'Compliant', y: testResultHostCount ? compliantHostCount : '0' },
    { x: 'Non-compliant', y: testResultHostCount - compliantHostCount },
    { x: 'Unsupported', y: unsupportedHostCount },
    { x: 'Not reporting', y: 0 },
  ];
  const chartColorScale = (testResultHostCount === 0 && [black300.value]) || [
    blue300.value,
    blue200.value,
    chart_color_gold_300.value,
    chart_color_black_200.value,
  ];
  const legendData = [
    {
      name:
        donutValues[0].y +
        ' ' +
        pluralize(donutValues[0].y, 'system') +
        ' compliant',
    },
    {
      name:
        donutValues[1].y +
        ' ' +
        pluralize(donutValues[1].y, 'system') +
        ' non-compliant',
    },
    {
      name:
        donutValues[2].y +
        ' ' +
        pluralize(donutValues[2].y, 'system') +
        ' not supported',
      symbol: { fill: chart_color_gold_300.value },
    },
    ...(notReportingHostCount > 0
      ? [
          {
            name:
              notReportingHostCount +
              ' ' +
              pluralize(notReportingHostCount, 'system') +
              ' not reporting',
            tooltip:
              notReportingHostCount +
              ' systems are not reporting scan results. This may be because the system is disconnected, or the insights-client is not properly configured to use Compliance.',
            symbol: { fill: chart_color_black_200.value },
          },
        ]
      : []),
  ];
  const compliancePercentage = testResultHostCount
    ? fixedPercentage(
        Math.floor(
          100 * (donutValues[0].y / (donutValues[0].y + donutValues[1].y))
        )
      )
    : 0;

  return (
    <div className="chart-inline">
      <div className="chart-container">
        <ChartDonut
          data={donutValues}
          identifier={donutId}
          title={compliancePercentage}
          subTitle="Compliant"
          themeVariant={ChartThemeVariant.light}
          colorScale={chartColorScale}
          style={{ fontSize: 20 }}
          constrainToVisibleArea={true}
          innerRadius={88}
          width={462}
          legendPosition="right"
          legendData={legendData}
          legendOrientation="vertical"
          legendComponent={
            <ChartLegend data={legendData} labelComponent={<LegendLabel />} />
          }
          padding={{
            bottom: 20,
            left: 0,
            right: 250,
            top: 20,
          }}
        />
      </div>
    </div>
  );
};

ReportChart.propTypes = {
  profile: propTypes.object,
};

export default ReportChart;
