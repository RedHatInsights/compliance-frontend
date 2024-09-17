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
import useAPIV2FeatureFlag from '@/Utilities/hooks/useAPIV2FeatureFlag';

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

// const calculateHostCounts = (
//   totalHostCount,
//   testResultHostCount,
//   compliantHostCount,
//   unsupportedHostCount
// ) => {
//   const isRestApiEnabled = useAPIV2FeatureFlag();
//   let notReportingHostCount;
//   let nonCompliantHostCount;
//   if (isRestApiEnabled) {
//     notReportingHostCount = totalHostCount - testResultHostCount;
//     nonCompliantHostCount =
//       testResultHostCount - compliantHostCount - unsupportedHostCount;
//   } else {
//     notReportingHostCount =
//       totalHostCount - unsupportedHostCount - testResultHostCount;
//     nonCompliantHostCount = testResultHostCount - compliantHostCount;
//   }

//   return { notReportingHostCount, nonCompliantHostCount };
// };

const calculateNotReportingHostCount = (
  isRestApiEnabled,
  totalHostCount,
  testResultHostCount,
  unsupportedHostCount
) => {
  let notReportingHostCount;
  if (isRestApiEnabled) {
    notReportingHostCount = totalHostCount - testResultHostCount;
  } else {
    notReportingHostCount =
      totalHostCount - unsupportedHostCount - testResultHostCount;
  }
  return notReportingHostCount;
};

const calculatenonCompliantHostCount = (
  isRestApiEnabled,
  testResultHostCount,
  compliantHostCount,
  unsupportedHostCount
) => {
  let nonCompliantHostCount;
  if (isRestApiEnabled) {
    nonCompliantHostCount =
      testResultHostCount - compliantHostCount - unsupportedHostCount;
  } else {
    nonCompliantHostCount = testResultHostCount - compliantHostCount;
  }
  return nonCompliantHostCount;
};

const useDonutChart = (profile) => {
  const {
    compliantHostCount = 0,
    testResultHostCount = 0,
    unsupportedHostCount = 0,
    totalHostCount = 0,
  } = profile;

  const isRestApiEnabled = useAPIV2FeatureFlag();
  const notReportingHostCount = calculateNotReportingHostCount(
    isRestApiEnabled,
    totalHostCount,
    testResultHostCount,
    unsupportedHostCount
  );
  const nonCompliantHostCount = calculatenonCompliantHostCount(
    isRestApiEnabled,
    testResultHostCount,
    compliantHostCount,
    unsupportedHostCount
  );

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
