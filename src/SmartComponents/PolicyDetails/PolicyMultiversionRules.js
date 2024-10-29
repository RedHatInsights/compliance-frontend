import React from 'react';
import propTypes from 'prop-types';
import { PageSection, PageSectionVariants } from '@patternfly/react-core';
import { TabbedRules } from 'PresentationalComponents';
import { mapCountOsMinorVersions } from 'Store/Reducers/SystemStore';
import { sortingByProp } from 'Utilities/helpers';
import * as Columns from '@/PresentationalComponents/RulesTable/Columns';

const PolicyMultiversionRules = ({
  policy,
  saveToPolicy,
  onRuleValueReset,
  DedicatedAction,
}) => {
  const {
    hosts,
    policy: { profiles },
  } = policy;
  const profilesForTabs = profiles.filter(
    (profile) => !!profile.osMinorVersion
  );
  const systemCounts = mapCountOsMinorVersions(hosts);

  const tabsData = profilesForTabs
    .sort(sortingByProp('osMinorVersion', 'desc'))
    .map((profile) => ({
      profile,
      systemCount: systemCounts[profile.osMinorVersion]?.count || 0,
    }));

  return (
    <React.Fragment>
      <PageSection variant={PageSectionVariants.light}>
        <TabbedRules
          tabsData={tabsData}
          setRuleValues={saveToPolicy}
          onRuleValueReset={onRuleValueReset}
          ruleValues={Object.fromEntries(
            profiles.map(({ id, values }) => [id, values])
          )}
          columns={[Columns.Name, Columns.Severity, Columns.Remediation]}
          level={1}
          options={{
            dedicatedAction: DedicatedAction,
          }}
          ouiaId="RHELVersions"
        />
      </PageSection>
    </React.Fragment>
  );
};

PolicyMultiversionRules.propTypes = {
  policy: propTypes.object.isRequired,
  saveToPolicy: propTypes.func,
  onRuleValueReset: propTypes.func,
  DedicatedAction: propTypes.node,
};

export default PolicyMultiversionRules;
