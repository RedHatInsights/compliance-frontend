import React from 'react';
import propTypes from 'prop-types';
import {
  Alert,
  Text,
  TextVariants,
  PageSection,
  PageSectionVariants,
} from '@patternfly/react-core';
import useProfileRules from 'Utilities/hooks/api/useProfileRules';
import useSupportedProfiles from 'Utilities/hooks/api/useSupportedProfiles';
import { RulesTable } from 'PresentationalComponents';
import EditRulesButtonToolbarItem from 'SmartComponents/PolicyDetails/EditRulesButtonToolbarItem';
import { Spinner } from '@patternfly/react-core';
import TableStateProvider from '@/Frameworks/AsyncTableTools/components/TableStateProvider';

const NoTailorings = ({ policy, columns }) => {
  const DedicatedAction = () => <EditRulesButtonToolbarItem policy={policy} />;
  const { data: profilesData } = useSupportedProfiles({
    params: {
      filter: `os_major_version=${policy.osMajorVersion} AND ref_id=${policy.refId}`,
    },
    skip: !policy,
  });

  const latestSupportedProfile = profilesData?.data?.[0];
  const securityGuideId = latestSupportedProfile?.security_guide_id;
  const profileId = latestSupportedProfile?.id;

  const {
    data: { data: rulesData, meta: { total } = {} } = {},
    loading: rulesLoading,
  } = useProfileRules({
    params: {
      securityGuideId: securityGuideId,
      profileId: profileId,
    },
    useTableState: true,
    skip: !profileId,
  });

  let isLoading = !profilesData;

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
          {isLoading ? (
            <Spinner size="sm" />
          ) : (
            latestSupportedProfile?.security_guide_version
          )}
          ). If you are using a different version of SSG for systems in this
          policy, those rules will be different and can be viewed on the systems
          details page.
        </Text>
      </PageSection>
      <RulesTable
        policyId={policy?.id}
        securityGuideId={securityGuideId}
        total={total}
        rules={rulesData}
        ansibleSupportFilter
        loading={rulesLoading}
        defaultTableView="rows"
        remediationsEnabled={false}
        columns={columns}
        DedicatedAction={DedicatedAction}
        skipValueDefinitions={true}
      />
    </React.Fragment>
  );
};

NoTailorings.propTypes = {
  policy: propTypes.object,
  columns: propTypes.arrayOf(propTypes.object),
};

const NoTailoringsTableStateProvider = ({ policy, columns }) => (
  <TableStateProvider>
    <NoTailorings policy={policy} columns={columns} />
  </TableStateProvider>
);

NoTailoringsTableStateProvider.propTypes = {
  policy: propTypes.object.isRequired,
  columns: propTypes.arrayOf(propTypes.object).isRequired,
};

export default NoTailoringsTableStateProvider;
