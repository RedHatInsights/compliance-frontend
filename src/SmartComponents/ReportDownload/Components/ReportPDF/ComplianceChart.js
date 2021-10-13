import React from 'react';
import propTypes from 'prop-types';
// eslint-disable-next-line rulesdir/disallow-fec-relative-imports
import { Chart } from '@redhat-cloud-services/frontend-components-pdf-generator';
import { fixedPercentage } from 'Utilities/TextHelper';

// TODO Legend table style need to be disablable
const ComplianceChart = ({
  policy: {
    testResultHostCount = 0,
    compliantHostCount = 0,
    percentCompliant = 0,
  },
}) => {
  const nonCompliantSystemsCount = testResultHostCount - compliantHostCount;
  const compliantSystemsChartData = [
    {
      x: `${compliantHostCount} systems compliant`,
      y: compliantHostCount,
    },
    {
      x: `${nonCompliantSystemsCount} systems non-compliant`,
      y: nonCompliantSystemsCount,
    },
  ];
  const compliancePercentage = fixedPercentage(percentCompliant);

  return (
    <Chart
      legendHeader={''}
      chartType="donut"
      subTitle="Compliant"
      colorSchema="blue"
      title={compliancePercentage}
      data={compliantSystemsChartData}
    />
  );
};

ComplianceChart.propTypes = {
  policy: propTypes.object,
};

export default ComplianceChart;
