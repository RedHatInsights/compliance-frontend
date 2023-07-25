import React from 'react';
import propTypes from 'prop-types';
import { paletteColors } from '../../../../constants';
// eslint-disable-next-line rulesdir/disallow-fec-relative-imports
import { Chart } from '@redhat-cloud-services/frontend-components-pdf-generator/dist/esm/index';
import { fixedPercentage } from 'Utilities/TextHelper';

// TODO Legend table style need to be disablable
const ComplianceChart = ({
  policy: { percentCompliant = 0 },
  compliantSystemCount,
  nonCompliantSystemCount,
  unsupportedSystemCount,
  nonReportingSystemCount,
}) => {
  const compliantSystemsChartData = [
    {
      x: `${compliantSystemCount} systems compliant`,
      y: compliantSystemCount,
    },
    {
      x: `${nonCompliantSystemCount} systems non-compliant`,
      y: nonCompliantSystemCount,
    },
    ...(unsupportedSystemCount > 0
      ? [
          {
            x: `${unsupportedSystemCount} systems not supported`,
            y: unsupportedSystemCount,
            color: paletteColors.gold300,
          },
        ]
      : []),
    ...(nonReportingSystemCount > 0
      ? [
          {
            x: `${nonReportingSystemCount} systems never reported`,
            y: nonReportingSystemCount,
          },
        ]
      : []),
  ];
  const compliancePercentage = fixedPercentage(percentCompliant);

  return (
    <Chart
      legendHeader={''}
      chartType="donut"
      subTitle="Compliant"
      colorSchema="multi"
      title={compliancePercentage}
      data={compliantSystemsChartData}
    />
  );
};

ComplianceChart.propTypes = {
  policy: propTypes.object,
  compliantSystemCount: propTypes.number,
  nonCompliantSystemCount: propTypes.number,
  unsupportedSystemCount: propTypes.number,
  nonReportingSystemCount: propTypes.number,
};

export default ComplianceChart;
