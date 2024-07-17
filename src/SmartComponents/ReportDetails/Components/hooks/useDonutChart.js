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
  rest.text = `${rest.text}: ${(percentOfDonut * 100).toFixed(2)}%`;
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

const useDonutChart = (profile) => {
  const {
    compliant_system_count = 0,
    reported_system_count = 0,
    unsupported_system_count = 0,
    assigned_system_count = 0,
  } = profile;
  const notReportingHostCount =
    assigned_system_count - unsupported_system_count - reported_system_count;
  const nonCompliantHostCount = reported_system_count - compliant_system_count;
  const donutId = profile.title?.replace(/ /g, '') || 'donut-chart';
  const donutValues = [
    { x: 'Compliant', y: compliant_system_count },
    { x: 'Non-compliant', y: nonCompliantHostCount },
    { x: 'Unsupported', y: unsupported_system_count },
    { x: 'Not reporting', y: notReportingHostCount },
  ];
  const chartColorScale = (assigned_system_count === 0 && [
    paletteColors.black300,
  ]) || [
    paletteColors.blue300,
    paletteColors.blue200,
    paletteColors.gold300,
    paletteColors.black200,
  ];
  const flyoutValues = [150, 180, 170, 170];
  const legendData = useLegendData(donutValues, profile);

  const compliancePercentage = fixedPercentage(
    assigned_system_count > 0
      ? Math.floor(100 * (compliant_system_count / assigned_system_count))
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
