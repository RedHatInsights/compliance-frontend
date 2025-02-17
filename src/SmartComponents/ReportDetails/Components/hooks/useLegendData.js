import React from 'react';
import { pluralize, Text } from '@patternfly/react-core';
import { SupportedSSGVersionsLink } from 'PresentationalComponents';
import { paletteColors } from '../../../../constants';

const useLegendData = (donutValues) => {
  const compliantSystemCount = donutValues[0].y;
  const nonCompliantSystemCount = donutValues[1].y;
  const unsupportedSystemCount = donutValues[2].y;
  const notReportingSystemCount = donutValues[3].y;

  return [
    {
      name: `${pluralize(compliantSystemCount, 'system')} compliant`,
      symbol: { fill: paletteColors.blue300 },
    },
    {
      name: `${pluralize(nonCompliantSystemCount, 'system')} non-compliant`,
      symbol: { fill: paletteColors.blue200 },
    },
    ...(unsupportedSystemCount > 0
      ? [
          {
            name: `${pluralize(
              unsupportedSystemCount,
              'system'
            )} not supported`,
            symbol: { fill: paletteColors.gold300 },
            popover: {
              title: 'Unsupported SSG versions',
              content: (
                <>
                  <Text variant="p">
                    These systems are running unsupported versions of the SCAP
                    Security Guide (SSG) for the version of RHEL installed on
                    them. Assessment of rules failed/passed on these systems is
                    a best-guess effort and may not be accurate.
                  </Text>
                  <Text variant="p">
                    The policy&apos;s compliance score excludes these systems.
                  </Text>
                </>
              ),
              footer: <SupportedSSGVersionsLink />,
            },
          },
        ]
      : []),
    ...(notReportingSystemCount > 0
      ? [
          {
            name: `${pluralize(
              notReportingSystemCount,
              'system'
            )} never reported`,
            popover: {
              title: 'Systems never reported',
              content: `${pluralize(
                notReportingSystemCount,
                'system'
              )} are not reporting scan results. This may be because the system is disconnected, or the insights-client is not properly configured to use Compliance.`,
            },
            symbol: { fill: paletteColors.black200 },
          },
        ]
      : []),
  ];
};

export default useLegendData;
