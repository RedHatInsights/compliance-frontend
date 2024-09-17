import React from 'react';
import { Text } from '@patternfly/react-core';
import { pluralize } from 'Utilities/TextHelper';
import { SupportedSSGVersionsLink } from 'PresentationalComponents';
import { paletteColors } from '../../../../constants';
import useAPIV2FeatureFlag from '@/Utilities/hooks/useAPIV2FeatureFlag';

const useLegendData = (donutValues, profile) => {
  const {
    testResultHostCount = 0,
    unsupportedHostCount = 0,
    totalHostCount = 0,
  } = profile;
  const isRestApiEnabled = useAPIV2FeatureFlag();
  let notReportingHostCount;
  if (isRestApiEnabled) {
    notReportingHostCount = totalHostCount - testResultHostCount;
  } else {
    notReportingHostCount =
      totalHostCount - unsupportedHostCount - testResultHostCount;
  }

  return [
    {
      name: `${donutValues[0].y} ${pluralize(
        donutValues[0].y,
        'system'
      )} compliant`,
      symbol: { fill: paletteColors.blue300 },
    },
    {
      name: `${donutValues[1].y} ${pluralize(
        donutValues[1].y,
        'system'
      )} non-compliant`,
      symbol: { fill: paletteColors.blue200 },
    },
    ...(unsupportedHostCount > 0
      ? [
          {
            name: `${donutValues[2].y} ${pluralize(
              donutValues[2].y,
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
    ...(notReportingHostCount > 0
      ? [
          {
            name: `${notReportingHostCount} ${pluralize(
              notReportingHostCount,
              'system'
            )} never reported`,
            popover: {
              title: 'Systems never reported',
              content: `${notReportingHostCount} ${pluralize(
                notReportingHostCount,
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
