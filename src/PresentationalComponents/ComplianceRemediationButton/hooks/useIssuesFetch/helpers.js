import sortBy from 'lodash/sortBy';
import { uniq } from 'Utilities/helpers';

const sortByPrecedence = (issues) => sortBy(issues, ['precedence']);

const isRemediatable = ({ result, remediation_issue_id }) =>
  result === 'fail' && !!remediation_issue_id;

const isSelected =
  (selectedRuleIds) =>
  ({ rule_id }) =>
    selectedRuleIds !== undefined ? selectedRuleIds.includes(rule_id) : true;

export const isReportTestResultSupported = (reportTestResult) =>
  reportTestResult?.supported ||
  reportTestResult?.testResultProfiles?.[0]?.supported;

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
    issues: sortByPrecedence(remediatableIssues).map(
      ({ precedence: _precedence, ...issue }) => issue,
    ),
  };
};
