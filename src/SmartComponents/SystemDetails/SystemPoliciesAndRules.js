import React, { useState } from 'react';
import propTypes from 'prop-types';
import natsort from 'natsort';
import useAPIV2FeatureFlag from '@/Utilities/hooks/useAPIV2FeatureFlag';
import RulesTable from '@/PresentationalComponents/RulesTable/RulesTable';
import { SystemPolicyCards as SystemPolicyCardsRest } from '../SystemPolicyCards/SystemPolicyCards';
import EmptyState from './EmptyState';
import {
  Tabs,
  Tab,
  TabTitleText,
  Bullseye,
  Spinner,
} from '@patternfly/react-core';
import SystemPolicyCards from '../../PresentationalComponents/SystemPolicyCards';

const SystemPoliciesAndRules = ({ data: { system }, loading, hidePassed }) => {
  const apiV2Enabled = useAPIV2FeatureFlag();
  const [selectedPolicy, setSelectedPolicy] = useState(
    system.testResultProfiles[0]?.id
  );
  const policies = system?.testResultProfiles;

  const sorter = natsort({ desc: false, insensitive: true });
  const sortedTestResultProfiles = system?.testResultProfiles.sort(
    (testResultProfile1, testResultProfile2) =>
      sorter(testResultProfile1?.name, testResultProfile2?.name)
  );

  return (
    <>
      {apiV2Enabled === undefined ? (
        <Bullseye>
          <Spinner />
        </Bullseye>
      ) : apiV2Enabled === true ? (
        <SystemPolicyCardsRest />
      ) : (
        <SystemPolicyCards policies={policies} loading={loading} />
      )}
      <br />
      {system?.testResultProfiles?.length ? (
        <>
          {system.testResultProfiles.length > 1 && (
            <Tabs
              activeKey={selectedPolicy}
              style={{
                background: 'var(--pf-v5-global--BackgroundColor--100)',
              }}
            >
              {sortedTestResultProfiles.map((policy, idx) => {
                return (
                  <Tab
                    key={'policy-tab-' + idx}
                    eventKey={policy.id}
                    title={<TabTitleText> {policy.name} </TabTitleText>}
                    onClick={() => {
                      setSelectedPolicy(policy.id);
                    }}
                  />
                );
              })}
            </Tabs>
          )}
          <RulesTable
            ansibleSupportFilter
            hidePassed={hidePassed}
            showFailedCounts
            system={{
              ...system,
              supported:
                (system?.testResultProfiles || []).filter(
                  (profile) => profile.supported
                ).length > 0,
            }}
            profileRules={system?.testResultProfiles
              .filter((policy) => selectedPolicy === policy.id)
              .map((profile) => ({
                system,
                profile,
                rules: profile.rules,
              }))}
            loading={loading}
            options={{
              sortBy: {
                index: 4,
                direction: 'asc',
                property: 'severity',
              },
            }}
          />
        </>
      ) : (
        <EmptyState system={system} />
      )}
    </>
  );
};

SystemPoliciesAndRules.propTypes = {
  data: propTypes.shape({
    system: propTypes.shape({
      hasPolicy: propTypes.bool,
      policies: propTypes.shape({
        id: propTypes.string,
      }),
      profiles: propTypes.array,
      testResultProfiles: propTypes.array,
    }),
  }),
  loading: propTypes.bool,
  hidePassed: propTypes.bool,
};

SystemPoliciesAndRules.defaultProps = {
  loading: true,
};

export default SystemPoliciesAndRules;
