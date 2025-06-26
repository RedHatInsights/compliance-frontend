import PropTypes from 'prop-types';
import React from 'react';
import { Text } from '@react-pdf/renderer';
import chart_color_red_100 from '@patternfly/react-tokens/dist/js/chart_color_red_100';
import global_BackgroundColor_150 from '@patternfly/react-tokens/dist/js/global_BackgroundColor_150';
import { Flex, FlexItem } from '@patternfly/react-core';
import { Table, Tbody, Td, Tr } from '@patternfly/react-table';
import { ChartDonut } from '@patternfly/react-charts';
import { fixedPercentage } from 'Utilities/TextHelper';
import { paletteColors } from '../../constants';

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
    paletteColors.blue200,
    paletteColors.gold300,
    paletteColors.black200,
  ];

  return (
    <React.Fragment>
      <Text style={{ color: chart_color_red_100.value }}>Policy details</Text>
      <Flex alignItems={{ default: 'alignItemsCenter' }}>
        <FlexItem flex={{ default: 'flex_2' }}>
          <Table variant="compact">
            <Tbody>
              <Tr style={{ fontSize: '12px' }}>
                <Td style={{ fontSize: '12px' }}>Policy type</Td>
                <Td style={{ fontSize: '12px' }}>{reportData.profile_title}</Td>
              </Tr>
              <Tr
                style={{
                  fontSize: '12px',
                  backgroundColor: global_BackgroundColor_150.var,
                }}
              >
                <Td style={{ fontSize: '12px' }}>Operating system</Td>
                <Td style={{ fontSize: '12px' }}>
                  RHEL {reportData.os_major_version}
                </Td>
              </Tr>
              <Tr style={{ fontSize: '12px' }}>
                <Td style={{ fontSize: '12px' }}>Compliance threshold</Td>
                <Td style={{ fontSize: '12px' }}>{threshold}</Td>
              </Tr>
              <Tr
                style={{
                  fontSize: '12px',
                  backgroundColor: global_BackgroundColor_150.var,
                }}
              >
                <Td style={{ fontSize: '12px' }}>Business objective</Td>
                <Td style={{ fontSize: '12px' }}>{businessObjective}</Td>
              </Tr>
            </Tbody>
          </Table>
        </FlexItem>
        <FlexItem flex={{ default: 'flex_3' }}>
          <ChartDonut
            ariaDesc="Average number of pets"
            ariaTitle="Donut chart example"
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
  reportData: PropTypes.object,
};

export default PolicyDetailsSection;
