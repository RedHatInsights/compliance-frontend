import React from 'react';
import propTypes from 'prop-types';
import {
  Alert,
  Text,
  TextVariants,
  PageSection,
  PageSectionVariants,
} from '@patternfly/react-core';
import { RulesTable } from 'PresentationalComponents';
import * as Columns from '@/PresentationalComponents/RulesTable/Columns';

import EditRulesButtonToolbarItem from './EditRulesButtonToolbarItem';

const PolicyRulesTab = ({ loading, policy }) => {
  const DedicatedAction = () => <EditRulesButtonToolbarItem policy={policy} />;
  const profile = policy.policy.profiles.find(
    (profile) => profile.refId === policy.refId
  );

  return (
    <React.Fragment>
      <Alert
        isInline
        ouiaId="RuleEditingAvailableAlert"
        variant="info"
        title="Rule editing is now available."
      >
        SCAP policies created before April 19th, 2021 with rule editing will use
        the full default set of rules for the policy with the most accurate
        benchmark for systems within the policy. Click the &quot;Edit
        rules&quot; or &quot;Edit policy&quot; button to edit rules.
      </Alert>
      <PageSection variant={PageSectionVariants.light}>
        <Text component={TextVariants.p}>
          <strong>What rules are shown on this list?&nbsp;</strong>
          This view shows rules that are from the latest SSG version (
          {profile?.benchmark.version}). If you are using a different version of
          SSG for systems in this policy, those rules will be different and can
          be viewed on the systems details page.
        </Text>
      </PageSection>
      <RulesTable
        remediationsEnabled={false}
        columns={[Columns.Name, Columns.Severity, Columns.Remediation]}
        loading={loading}
        profileRules={[
          {
            profile: { refId: policy.refId, name: policy.name },
            rules: profile?.rules || [],
          },
        ]}
        options={{
          dedicatedAction: DedicatedAction,
        }}
      />
    </React.Fragment>
  );
};

PolicyRulesTab.propTypes = {
  loading: propTypes.bool,
  policy: propTypes.shape({
    name: propTypes.string,
    refId: propTypes.string,
    policy: propTypes.shape({
      profiles: propTypes.shape([
        {
          rules: propTypes.array,
          benchmark: propTypes.object,
        },
      ]).isRequired,
    }),
  }),
};

export default PolicyRulesTab;
