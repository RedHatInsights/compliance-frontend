import React, { Fragment } from 'react';
import propTypes from 'prop-types';
import { Text, View } from '@react-pdf/renderer';
// eslint-disable-next-line rulesdir/disallow-fec-relative-imports
import {
  Panel,
  Table,
  Column,
  Section,
} from '@redhat-cloud-services/frontend-components-pdf-generator';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import { fixedPercentage } from 'Utilities/TextHelper';
import styles from './ReportPDF/StyleSheet';
import SystemsTable from './ReportPDF/SystemsTable';
import UnsupportedSystemsTable from './ReportPDF/UnsupportedSystemsTable';
import NonReportedSystemsTable from './ReportPDF/NonReportedSystemsTable';
import RulesTable from './ReportPDF/RulesTable';
import PanelItem from './ReportPDF/PanelItem';
import SubSection from './ReportPDF/SubSection';
import ComplianceChart from './ReportPDF/ComplianceChart';

const ReportPDF = ({ data, ssgFinder }) => {
  const {
    totalHostCount,
    compliantSystems,
    compliantSystemCount,
    nonCompliantSystems,
    nonCompliantSystemCount,
    topTenFailedRules,
    unsupportedSystems,
    unsupportedSystemCount,
    nonReportingSystems,
    nonReportingSystemCount,
    userNotes,
    policy,
  } = data;
  const { testResultHostCount = 0, compliantHostCount = 0 } = policy;
  const percentCompliant =
    testResultHostCount != 0
      ? fixedPercentage(Math.floor(100 * (compliantHostCount / totalHostCount)))
      : 0;

  return (
    <Fragment>
      <Text style={styles.subSectionTitle}>{`Report prepared ${
        DateFormat({ date: new Date(), type: 'exact' }).props.children
      }`}</Text>

      {userNotes && (
        <View style={styles.userNotes}>
          <View style={styles.userNotesTitle}>
            <Text>User notes</Text>
          </View>
          <View>
            <Text>{userNotes}</Text>
          </View>
        </View>
      )}

      <Section
        title="Policy Details"
        titleProps={{
          style: styles.sectionTitle,
        }}
      >
        <Column style={{ width: '150px' }}>
          <Table
            // TODO: correct left side styling
            rows={[
              ['Policy type', policy.policyType],
              ['Operating system', `RHEL ${policy.osMajorVersion}`],
              ['Compliance threshold', `${policy.complianceThreshold}%`],
              ['Business Objective', policy.businessObjective || '--'],
            ]}
          />
        </Column>
        <Column>
          <ComplianceChart
            policy={{
              ...policy,
              percentCompliant,
            }}
            {...{
              compliantSystemCount,
              nonCompliantSystemCount,
              unsupportedSystemCount,
              nonReportingSystemCount,
            }}
          />
        </Column>
      </Section>

      <Section
        title="Systems"
        withColumn={false}
        titleProps={{
          style: styles.sectionTitle,
        }}
      >
        <Panel withColumn={false} style={{ marginBottom: '20px' }}>
          <PanelItem title="Non-compliant systems">
            {nonCompliantSystemCount}
          </PanelItem>

          {unsupportedSystemCount ? (
            <PanelItem title="Systems with unsupported configuration">
              {unsupportedSystemCount}
            </PanelItem>
          ) : null}

          {nonReportingSystemCount ? (
            <PanelItem title="Systems never reported">
              {nonReportingSystemCount}
            </PanelItem>
          ) : null}

          <PanelItem title="Compliant systems">
            {compliantSystemCount}
          </PanelItem>
        </Panel>

        {nonCompliantSystems && nonCompliantSystemCount ? (
          <SubSection title="Non-compliant systems">
            <SystemsTable systems={nonCompliantSystems} />
          </SubSection>
        ) : null}

        {unsupportedSystems && unsupportedSystemCount ? (
          <SubSection title="Systems with unsupported configuration">
            <UnsupportedSystemsTable
              systems={unsupportedSystems}
              ssgFinder={ssgFinder}
            />
          </SubSection>
        ) : null}

        {nonReportingSystems && nonReportingSystemCount ? (
          <SubSection title="Systems never reported">
            <NonReportedSystemsTable systems={nonReportingSystems} />
          </SubSection>
        ) : null}

        {compliantSystems && compliantSystemCount ? (
          <SubSection title="Compliant systems">
            <SystemsTable systems={compliantSystems} />
          </SubSection>
        ) : null}
      </Section>

      {topTenFailedRules ? (
        <Section
          title="Rules"
          withColumn={false}
          titleProps={{
            style: styles.sectionTitle,
          }}
        >
          <SubSection title="Top failed rules">
            <RulesTable rules={topTenFailedRules} />
          </SubSection>
        </Section>
      ) : null}
    </Fragment>
  );
};

ReportPDF.propTypes = {
  data: propTypes.object,
  ssgFinder: propTypes.func,
};

export default ReportPDF;
