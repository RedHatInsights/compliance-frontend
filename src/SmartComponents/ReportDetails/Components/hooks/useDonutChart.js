import React from 'react';
import propTypes from 'prop-types';
import {
  ChartTooltip,
  ChartLabel,
  ChartThemeColor,
} from '@patternfly/react-charts';
import { Icon } from '@patternfly/react-core';
import { paletteColors } from '../../../../constants';
import { fixedPercentage } from 'Utilities/TextHelper';
import useLegendData from './useLegendData';
import { SquareFullIcon } from '@patternfly/react-icons';

const DonutLabel = ({
  x,
  y,
  datum,
  chartColorScale,
  flyoutValues,
  ...rest
}) => {
  const iconLeftEdge = x - flyoutValues[datum._x - 1] / 2 + 5;
  const percentOfDonut = (datum.endAngle - datum.startAngle) / 360;
  rest.text = `${rest.text}: ${(percentOfDonut * 100).toFixed(1)}%`;
  return (
    <g>
      <foreignObject height="100%" width="100%" x={iconLeftEdge} y={y - 11}>
        <Icon>
          <SquareFullIcon color={chartColorScale[datum._x - 1]} />
        </Icon>
      </foreignObject>
      <ChartLabel x={x + 10} y={y} {...rest} />
    </g>
  );
};

DonutLabel.propTypes = {
  x: propTypes.number,
  y: propTypes.number,
  datum: propTypes.object,
  chartColorScale: propTypes.array,
  flyoutValues: propTypes.array,
};

const useDonutChart = (report) => {
  const {
    compliant_system_count: compliantSystemCount = 0,
    reported_system_count: testResultSystemCount = 0,
    unsupported_system_count: unsupportedSystemCount = 0,
    assigned_system_count: totalSystemCount = 0,
  } = report;

  const notReportingSystemCount = totalSystemCount - testResultSystemCount;
  // TODO: This is not always true as unsupported.
  // Deal with it after RHINENG-14550
  const nonCompliantSystemCount =
    testResultSystemCount - compliantSystemCount - unsupportedSystemCount;

  const donutId = report.title?.replace(/ /g, '') || 'donut-chart';
  const donutValues = [
    { x: 'Compliant', y: compliantSystemCount },
    { x: 'Non-compliant', y: nonCompliantSystemCount },
    { x: 'Unsupported', y: unsupportedSystemCount },
    { x: 'Not reporting', y: notReportingSystemCount },
  ];
  const chartColorScale = (totalSystemCount === 0 && [
    paletteColors.black300,
  ]) || [
    paletteColors.blue300,
    paletteColors.blue200,
    paletteColors.gold300,
    paletteColors.black200,
  ];
  const flyoutValues = [150, 180, 170, 170];
  const legendData = useLegendData(donutValues);

  const compliancePercentage = fixedPercentage(
    totalSystemCount > 0
      ? Math.floor(100 * (compliantSystemCount / totalSystemCount))
      : 0
  );

  return {
    chartProps: {
      data: donutValues,
      labelComponent: (
        <ChartTooltip
          flyoutWidth={({ index }) => flyoutValues[index]}
          labelComponent={
            <DonutLabel
              chartColorScale={chartColorScale}
              flyoutValues={flyoutValues}
            />
          }
          constrainToVisibleArea={true}
        />
      ),
      identifier: donutId,
      title: compliancePercentage,
      subTitle: 'Compliant',
      themeVariant: ChartThemeColor.light,
      colorScale: chartColorScale,
      style: { fontSize: 20 },
      innerRadius: 88,
      constrainToVisibleArea: true,
    },
    legendData,
  };
};

export default useDonutChart;
