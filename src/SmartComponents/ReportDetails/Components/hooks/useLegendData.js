import React from 'react';
import { Text } from '@patternfly/react-core';
import blue200 from '@patternfly/react-tokens/dist/esm/chart_color_blue_200';
import blue300 from '@patternfly/react-tokens/dist/esm/chart_color_blue_300';
import chart_color_black_200 from '@patternfly/react-tokens/dist/esm/chart_color_black_200';
import chart_color_gold_300 from '@patternfly/react-tokens/dist/esm/chart_color_gold_300';
import { pluralize } from 'Utilities/TextHelper';
import { SupportedSSGVersionsLink } from 'PresentationalComponents';

const useLegendData = (donutValues, profile) => {
  const {
    testResultHostCount = 0,
    unsupportedHostCount = 0,
    totalHostCount = 0,
  } = profile;
  const notReportingHostCount =
    totalHostCount - unsupportedHostCount - testResultHostCount;

  return [
    {
      name: `${donutValues[0].y} ${pluralize(
        donutValues[0].y,
        'system'
      )} compliant`,
      symbol: { fill: blue300.value },
    },
    {
      name: `${donutValues[1].y} ${pluralize(
        donutValues[1].y,
        'system'
      )} non-compliant`,
      symbol: { fill: blue200.value },
    },
    {
      name: `${donutValues[2].y} ${pluralize(
        donutValues[2].y,
        'system'
      )} not supported`,
      symbol: { fill: chart_color_gold_300.value },
      popover: {
        title: 'Unsupported SSG versions',
        content: (
          <>
            <Text variant="p">
              These systems are running unsupported versions of the SCAP
              Security Guide (SSG) for the version of RHEL installed on them.
              Assessment of rules failed/passed on these systems is a best-guess
              effort and may not be accurate.
            </Text>
            <Text variant="p">
              The policy&apos;s compliance score excludes these systems.
            </Text>
          </>
        ),
        footer: <SupportedSSGVersionsLink />,
      },
    },
    ...(notReportingHostCount > 0
      ? [
          {
            name: `${notReportingHostCount} ${pluralize(
              notReportingHostCount,
              'system'
            )} not reporting`,
            popover: {
              title: 'Systems never reported',
              content: `${notReportingHostCount} ${pluralize(
                notReportingHostCount,
                'system'
              )} are not reporting scan results. This may be because the system is disconnected, or the insights-client is not properly configured to use Compliance.`,
            },
            symbol: { fill: chart_color_black_200.value },
          },
        ]
      : []),
  ];
};

export default useLegendData;
