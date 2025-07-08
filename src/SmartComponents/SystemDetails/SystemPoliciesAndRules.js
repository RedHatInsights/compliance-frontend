import React, { useState } from 'react';
import propTypes from 'prop-types';
import SystemPolicyCards from '../SystemPolicyCards/SystemPolicyCards';
import { Tabs, Tab, TabTitleText } from '@patternfly/react-core';
import RuleResults from './RuleResults';

const SystemPoliciesAndRules = ({
  systemId,
  reportTestResults,
  hidePassed,
}) => {
  // FYI: test result ID and policy ID are not the same, but test result ID only identifies each tab here.
  const [selectedPolicy, setSelectedPolicy] = useState(
    reportTestResults[0].report_id,
  );

  return (
    <>
      <SystemPolicyCards reportTestResults={reportTestResults} />
      <br />
      <Tabs activeKey={selectedPolicy}>
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

SystemPoliciesAndRules.propTypes = {
  systemId: propTypes.string.isRequired,
  reportTestResults: propTypes.array.isRequired,
  hidePassed: propTypes.bool,
};

SystemPoliciesAndRules.defaultProps = {
  loading: true,
};

export default SystemPoliciesAndRules;
