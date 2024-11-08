import RulesTable from '../../PresentationalComponents/RulesTable/RulesTableRest';
import propTypes from 'prop-types';
import useBatchedReportRuleResults from './useBatchedReportRuleResults';
import { Bullseye, Spinner } from '@patternfly/react-core';

const RuleResults = ({ hidePassed, reportTestResult }) => {
  const { ruleResults, loading, error } = useBatchedReportRuleResults(
    reportTestResult.report_id,
    reportTestResult.id
  );

  console.log('### ruleResults', ruleResults, loading, error);

  return ruleResults === undefined || loading === true ? (
    <Bullseye>
      <Spinner />
    </Bullseye>
  ) : (
    /*  <RulesTable
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
    /> */
    'test'
  );
};

RuleResults.propTypes = {
  hidePassed: propTypes.bool,
  reportTestResult: propTypes.object,
};

export default RuleResults;
