import React from 'react';
import propTypes from 'prop-types';
import { ChartLabel } from '@patternfly/react-charts/dist/esm/components/ChartLabel/index';
import { ChartThemeVariant } from '@patternfly/react-charts/dist/esm/components/ChartTheme/index';
import { ChartTooltip } from '@patternfly/react-charts/dist/esm/components/ChartTooltip/index';
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
    compliantHostCount = 0,
    testResultHostCount = 0,
    unsupportedHostCount = 0,
    totalHostCount = 0,
  } = profile;
  const notReportingHostCount =
    totalHostCount - unsupportedHostCount - testResultHostCount;
  const nonCompliantHostCount = testResultHostCount - compliantHostCount;
  const donutId = profile.name?.replace(/ /g, '') || 'donut-chart';
  const donutValues = [
    { x: 'Compliant', y: compliantHostCount },
    { x: 'Non-compliant', y: nonCompliantHostCount },
    { x: 'Unsupported', y: unsupportedHostCount },
    { x: 'Not reporting', y: notReportingHostCount },
  ];
  const chartColorScale = (totalHostCount === 0 && [
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
    totalHostCount > 0
      ? Math.floor(100 * (compliantHostCount / totalHostCount))
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
      themeVariant: ChartThemeVariant.light,
      colorScale: chartColorScale,
      style: { fontSize: 20 },
      innerRadius: 88,
      constrainToVisibleArea: true,
    },
    legendData,
  };
};

export default useDonutChart;
