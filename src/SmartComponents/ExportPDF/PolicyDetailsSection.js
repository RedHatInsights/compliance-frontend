import PropTypes from 'prop-types';
import React from 'react';
import {
  chart_global_FontSize_lg,
  chart_global_FontSize_2xl,
  t_color_red_70,
  t_global_spacer_md,
} from '@patternfly/react-tokens';
import {
  DescriptionList,
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription,
  Flex,
  FlexItem,
  Content,
} from '@patternfly/react-core';
import { ChartDonut } from '@patternfly/react-charts/victory';
import { fixedPercentage } from 'Utilities/TextHelper';
import { paletteColors } from '@/constants';

const PolicyDetailsSection = ({ reportData }) => {
  const threshold = fixedPercentage(reportData.compliance_threshold);
  const businessObjective =
    reportData.business_objective === null
      ? '--'
      : reportData.business_objective;
  const donutTitle = fixedPercentage(reportData.percent_compliant);

  const compliantSystemCount = reportData.compliant_system_count;
  const unsupportedSystemCount = reportData.unsupported_system_count;
  const testResultSystemCount = reportData.reported_system_count;
  const totalSystemCount = reportData.assigned_system_count;

  const notReportingSystemCount = totalSystemCount - testResultSystemCount;
  const nonCompliantSystemCount =
    testResultSystemCount - compliantSystemCount - unsupportedSystemCount;

  const donutValues = [
    { x: 'Compliant', y: compliantSystemCount },
    { x: 'Non-compliant', y: nonCompliantSystemCount },
    { x: 'Unsupported', y: unsupportedSystemCount },
    { x: 'Not reporting', y: notReportingSystemCount },
  ];

  const chartColorScale = [
    paletteColors.blue300,
    paletteColors.blue100,
    paletteColors.gold300,
    paletteColors.black200,
  ];

  return (
    <React.Fragment>
      <Content
        style={{
          color: t_color_red_70.value,
          fontSize: chart_global_FontSize_lg.value,
          marginBottom: t_global_spacer_md.value,
        }}
      >
        Policy details
      </Content>
      <Flex alignItems={{ default: 'alignItemsCenter' }}>
        <FlexItem flex={{ default: 'flex_2' }}>
          <DescriptionList isCompact>
            <DescriptionListGroup>
              <DescriptionListTerm
                style={{ fontSize: chart_global_FontSize_2xl.value }}
              >
                Policy type
              </DescriptionListTerm>
              <DescriptionListDescription>
                {reportData.profile_title}
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm
                style={{ fontSize: chart_global_FontSize_2xl.value }}
              >
                Operating system
              </DescriptionListTerm>
              <DescriptionListDescription>
                RHEL {reportData.os_major_version}
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm
                style={{ fontSize: chart_global_FontSize_2xl.value }}
              >
                Compliance threshold
              </DescriptionListTerm>
              <DescriptionListDescription>
                {threshold}
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm
                style={{ fontSize: chart_global_FontSize_2xl.value }}
              >
                Business objective
              </DescriptionListTerm>
              <DescriptionListDescription>
                {businessObjective}
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </FlexItem>
        <FlexItem flex={{ default: 'flex_3' }}>
          <ChartDonut
            ariaTitle="Compliance donut chart"
            constrainToVisibleArea
            data={donutValues}
            legendData={[
              { name: `Compliant systems: ${compliantSystemCount}` },
              { name: `Non compliant systems: ${nonCompliantSystemCount}` },
              { name: `Unsupported systems: ${unsupportedSystemCount}` },
              { name: `Never reported systems: ${notReportingSystemCount}` },
            ]}
            name="My chart"
            title={donutTitle}
            subTitle="Compliant"
            colorScale={chartColorScale}
            legendOrientation="vertical"
            legendPosition="right"
            height={200}
            width={420}
            padding={{
              bottom: 20,
              left: 0,
              right: 220, // Adjusted to accommodate legend
              top: 20,
            }}
          />
        </FlexItem>
      </Flex>
    </React.Fragment>
  );
};

PolicyDetailsSection.propTypes = {
  reportData: PropTypes.shape({
    business_objective: PropTypes.string,
    compliance_threshold: PropTypes.number,
    os_major_version: PropTypes.number,
    profile_title: PropTypes.string,
    percent_compliant: PropTypes.number,
    assigned_system_count: PropTypes.number,
    compliant_system_count: PropTypes.number,
    unsupported_system_count: PropTypes.number,
    reported_system_count: PropTypes.number,
  }),
};

export default PolicyDetailsSection;
