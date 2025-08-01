import React from 'react';
import propTypes from 'prop-types';
import { paletteColors } from '../../../../constants';

import { Chart } from '@redhat-cloud-services/frontend-components-pdf-generator/dist/esm/index';
import { fixedPercentage } from 'Utilities/TextHelper';
import { pluralize } from '@patternfly/react-core';

// TODO Legend table style need to be disablable
const ComplianceChart = ({
  percentCompliant = 0,
  compliantSystemCount,
  nonCompliantSystemCount,
  unsupportedSystemCount,
  nonReportingSystemCount,
}) => {
  const compliantSystemsChartData = [
    {
      x: `${pluralize(compliantSystemCount, 'system')} compliant`,
      y: compliantSystemCount,
    },
    {
      x: `${pluralize(nonCompliantSystemCount, 'system')} non-compliant`,
      y: nonCompliantSystemCount,
    },
    ...(unsupportedSystemCount > 0
      ? [
          {
            x: `${pluralize(unsupportedSystemCount, 'system')} not supported`,
            y: unsupportedSystemCount,
            color: paletteColors.gold300,
          },
        ]
      : []),
    ...(nonReportingSystemCount > 0
      ? [
          {
            x: `${pluralize(nonReportingSystemCount, 'system')} never reported`,
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
  percentCompliant: propTypes.number,
  compliantSystemCount: propTypes.number,
  nonCompliantSystemCount: propTypes.number,
  unsupportedSystemCount: propTypes.number,
  nonReportingSystemCount: propTypes.number,
};

export default ComplianceChart;
