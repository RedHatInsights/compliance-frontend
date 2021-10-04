import React, { Fragment } from 'react';
import propTypes from 'prop-types';
import { Text, View } from '@react-pdf/renderer';
// eslint-disable-next-line rulesdir/disallow-fec-relative-imports
import {
  Paragraph,
  Panel,
  Table,
  Column,
  Section,
} from '@redhat-cloud-services/frontend-components-pdf-generator';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import styles from './ReportPDF/StyleSheet';
import SystemsTable from './ReportPDF/SystemsTable';
import UnsupportedSystemsTable from './ReportPDF/UnsupportedSystemsTable';
import RulesTable from './ReportPDF/RulesTable';
import PanelItem from './ReportPDF/PanelItem';
import SubSection from './ReportPDF/SubSection';
import ComplianceChart from './ReportPDF/ComplianceChart';

const ReportPDF = ({ data, ssgFinder }) => {
  const {
    compliantSystems,
    compliantSystemCount,
    nonCompliantSystems,
    nonCompliantSystemCount,
    topTenFailedRules,
    unsupportedSystems,
    unsupportedSystemCount,
    userNotes,
    policy,
  } = data;
  const { testResultHostCount = 0, compliantHostCount = 0 } = policy;
  const percentCompliant = Math.floor(
    100 * (compliantHostCount / testResultHostCount)
  );

  return (
    <Fragment>
      <Text style={styles.subSectionTitle}>{`Report prepared ${
        DateFormat({ date: new Date(), type: 'exact' }).props.children
      }`}</Text>

      {userNotes && (
        <View style={styles.userNotes}>
          <Paragraph style={styles.userNotesTitle}>
            <Text style={styles.bold}>User notes</Text>
          </Paragraph>
          <Paragraph>
            <Text>{userNotes}</Text>
          </Paragraph>
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
              ['Business Objective', policy.businessObjective?.title || '--'],
            ]}
          />
        </Column>
        <Column>
          <ComplianceChart
            policy={{
              ...policy,
              percentCompliant,
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
        <Panel withColumn={false}>
          <PanelItem title="Non-compliant systems">
            {nonCompliantSystemCount}
          </PanelItem>

          {unsupportedSystemCount ? (
            <PanelItem title="Systems with unsupported configuration">
              {unsupportedSystemCount}
            </PanelItem>
          ) : null}

          <PanelItem title="Compliant systems">
            {compliantSystemCount}
          </PanelItem>
        </Panel>

        {nonCompliantSystems && nonCompliantSystemCount ? (
          <SubSection
            title="Non-compliant systems"
            metaTitle={`${nonCompliantSystemCount} systems (${
              100 - percentCompliant
            }% non-compliant)`}
          >
            <SystemsTable systems={nonCompliantSystems} />
          </SubSection>
        ) : null}

        {unsupportedSystems && unsupportedSystemCount ? (
          <SubSection
            title="Systems with unsupported configuration"
            metaTitle={`${unsupportedSystemCount} systems`}
          >
            <UnsupportedSystemsTable
              systems={unsupportedSystems}
              ssgFinder={ssgFinder}
            />
          </SubSection>
        ) : null}

        {compliantSystems && compliantSystemCount ? (
          <SubSection
            title="Compliant systems"
            metaTitle={`${compliantSystemCount} systems (${percentCompliant}% compliant)`}
          >
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
