import PropTypes from 'prop-types';
import React from 'react';
import {
  DescriptionList,
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription,
  Content,
} from '@patternfly/react-core';
import { ChartDonut } from '@patternfly/react-charts/victory';
import { fixedPercentage } from 'Utilities/TextHelper';
import { paletteColors } from '@/constants';

const PolicyDetailsSection = ({ reportData, styles }) => {
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
      <Content style={styles.sectionHeader}>Policy details</Content>
      <div>
        <div
          style={{
            display: 'inline-block',
            width: '35%',
            verticalAlign: 'top',
            paddingRight: '20px',
          }}
        >
          <DescriptionList isCompact>
            <DescriptionListGroup>
              <DescriptionListTerm style={styles.descriptionListTerm}>
                Policy type
              </DescriptionListTerm>
              <DescriptionListDescription>
                {reportData.profile_title}
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm style={styles.descriptionListTerm}>
                Operating system
              </DescriptionListTerm>
              <DescriptionListDescription>
                RHEL {reportData.os_major_version}
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm style={styles.descriptionListTerm}>
                Compliance threshold
              </DescriptionListTerm>
              <DescriptionListDescription>
                {threshold}
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm style={styles.descriptionListTerm}>
                Business objective
              </DescriptionListTerm>
              <DescriptionListDescription>
                {businessObjective}
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </div>
        <div
          style={{
            display: 'inline-block',
            width: '65%',
            verticalAlign: 'top',
          }}
        >
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
        </div>
      </div>
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
  styles: PropTypes.object.isRequired,
};

export default PolicyDetailsSection;
