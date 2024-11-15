import React, { useState } from 'react';
import propTypes from 'prop-types';
import SystemPolicyCards from '../SystemPolicyCards/SystemPolicyCards';
import { Tabs, Tab, TabTitleText } from '@patternfly/react-core';
import RuleResults from './RuleResults';

const SystemPoliciesAndRulesRest = ({
  systemId,
  reportTestResults,
  hidePassed,
}) => {
  // FYI: test result ID and policy ID are not the same, but test result ID only identifies each tab here.
  const [selectedPolicy, setSelectedPolicy] = useState(
    reportTestResults[0].report_id
  );

  console.log('### reportTestResults', reportTestResults);
  return (
    <>
      <SystemPolicyCards reportTestResults={reportTestResults} />
      <br />
      <Tabs
        activeKey={selectedPolicy}
        style={{
          background: 'var(--pf-v5-global--BackgroundColor--100)',
        }}
      >
        {reportTestResults.map((reportTestResult, idx) => (
          <Tab
            key={'policy-tab-' + idx}
            eventKey={reportTestResult.report_id}
            title={<TabTitleText> {reportTestResult.title} </TabTitleText>}
            onClick={() => {
              setSelectedPolicy(reportTestResult.report_id);
            }}
          >
            <RuleResults
              systemId={systemId}
              reportTestResult={reportTestResult}
              hidePassed={hidePassed}
            />
          </Tab>
        ))}
      </Tabs>
    </>
  );
};

SystemPoliciesAndRulesRest.propTypes = {
  systemId: propTypes.string.isRequired,
  reportTestResults: propTypes.array.isRequired,
  hidePassed: propTypes.bool,
};

SystemPoliciesAndRulesRest.defaultProps = {
  loading: true,
};

export default SystemPoliciesAndRulesRest;
