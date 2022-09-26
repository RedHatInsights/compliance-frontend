import { ChartThemeVariant } from '@patternfly/react-charts';
import black300 from '@patternfly/react-tokens/dist/esm/global_palette_black_300';
import blue200 from '@patternfly/react-tokens/dist/esm/chart_color_blue_200';
import blue300 from '@patternfly/react-tokens/dist/esm/chart_color_blue_300';
import chart_color_black_200 from '@patternfly/react-tokens/dist/esm/chart_color_black_200';
import chart_color_gold_300 from '@patternfly/react-tokens/dist/esm/chart_color_gold_300';
import { fixedPercentage } from 'Utilities/TextHelper';
import useLegendData from './useLegendData';

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
  const chartColorScale = (totalHostCount === 0 && [black300.value]) || [
    blue300.value,
    blue200.value,
    chart_color_gold_300.value,
    chart_color_black_200.value,
  ];
  const legendData = useLegendData(donutValues, profile);

  const compliancePercentage = testResultHostCount
    ? fixedPercentage(Math.floor(100 * (compliantHostCount / totalHostCount)))
    : 0;

  return {
    chartProps: {
      data: donutValues,
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
