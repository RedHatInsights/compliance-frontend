import React, { useState } from 'react';
import propTypes from 'prop-types';
import natsort from 'natsort';
import RulesTable from '@/PresentationalComponents/RulesTable/RulesTable';
import SystemPolicyCards from '../SystemPolicyCards/SystemPolicyCards';
import { Tabs, Tab, TabTitleText } from '@patternfly/react-core';

const SystemPoliciesAndRulesRest = ({ systemId, testResults, hidePassed }) => {
  // FYI: test result ID and policy ID are not the same, but test result ID only identifies each tab here.
  const [selectedPolicy, setSelectedPolicy] = useState(testResults[0].id);

  const policies = system?.testResultProfiles;

  const sorter = natsort({ desc: false, insensitive: true });
  const sortedTestResultProfiles = system?.testResultProfiles.sort(
    (testResultProfile1, testResultProfile2) =>
      sorter(testResultProfile1?.name, testResultProfile2?.name)
  );

  // TODO: test that system policy cards are displayed correctly before diving into the rules table

  return (
    <>
      <SystemPolicyCards testResults={testResults} />
      {/* <br />
      {testResults.length > 1 && (
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
      /> */}
    </>
  );
};

SystemPoliciesAndRulesRest.propTypes = {
  systemId: propTypes.string.isRequired,
  testResults: propTypes.array.isRequired,
  hidePassed: propTypes.bool,
};

SystemPoliciesAndRulesRest.defaultProps = {
  loading: true,
};

export default SystemPoliciesAndRulesRest;
