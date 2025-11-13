import { uniq } from 'Utilities/helpers';

const isRemediatable = ({ result, remediation_issue_id }) =>
  result === 'fail' && !!remediation_issue_id;

const isSelected =
  (selectedRuleIds) =>
  ({ id }) =>
    selectedRuleIds !== undefined ? selectedRuleIds.includes(id) : true;

export const isReportTestResultSupported = (reportTestResult) => {
  return reportTestResult?.supported;
};

export const buildFetchQueue = (reportTestResults) =>
  reportTestResults
    .filter(isReportTestResultSupported)
    .map(({ id: testResultId }) => ({
      testResultId,
    }));

export const compileRemediatonData = (ruleResults, selectedRuleIds) => {
  const remediatableIssues = Object.values(
    ruleResults
      .filter(isRemediatable)
      .filter(isSelected(selectedRuleIds))
      .reduce(
        (
          remediationResult,
          { rule_id, remediation_issue_id, system_id, description, precedence },
        ) => ({
          ...remediationResult,
          [rule_id]: {
            id: remediation_issue_id,
            precedence,
            description,
            systems: uniq([
              ...(remediationResult[rule_id]?.systems || []),
              system_id,
            ]),
          },
        }),
        {},
      ),
  );

  const systems = uniq(
    remediatableIssues.reduce((systemIds, { systems }) => {
      return [...(systemIds || []), ...(systems || [])];
    }, []),
  );

  return {
    systems,
    issues: remediatableIssues,
  };
};
