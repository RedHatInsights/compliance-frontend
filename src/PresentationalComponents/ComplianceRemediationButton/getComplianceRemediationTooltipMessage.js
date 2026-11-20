import { isReportTestResultSupported } from './hooks/useIssuesFetch/helpers';
import { getTerm } from '@/Utilities/helpers';

export const getComplianceRemediationTooltipMessage = (reportTestResults) => {
  if (!reportTestResults?.length) {
    return undefined;
  }

  const supported = reportTestResults.filter(isReportTestResultSupported);
  if (!supported.length) {
    return `Unsupported ${getTerm('system', { plural: true, lowercase: true })} cannot be remediated.`;
  }

  const failedRuleCount = (r) => r.failed_rule_count ?? 0;
  const withFailures = supported.filter((r) => failedRuleCount(r) > 0);
  const fullyCompliant = supported.filter((r) => failedRuleCount(r) === 0);

  if (withFailures.length === 0) {
    return supported.length === 1
      ? `The ${getTerm('system', { lowercase: true })} is 100% compliant. No remediation is required.`
      : `The selected ${getTerm('system', { plural: true, lowercase: true })} are 100% compliant. No remediation is required.`;
  }

  const hasUnsupportedSelected = reportTestResults.length > supported.length;
  const hasSupportedMixedCompliantAndFailed =
    fullyCompliant.length > 0 && withFailures.length > 0;

  if (
    hasSupportedMixedCompliantAndFailed ||
    (hasUnsupportedSelected && withFailures.length > 0)
  ) {
    return `The remediation plan includes only supported ${getTerm('system', { plural: true, lowercase: true })} that failed compliance.`;
  }

  return undefined;
};
