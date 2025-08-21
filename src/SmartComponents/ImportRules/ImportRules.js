import React, { useCallback, useState } from 'react';
import propTypes from 'prop-types';
import { useParams } from 'react-router-dom';

import { Content, ContentVariants } from '@patternfly/react-core';

import VersionSelector from './components/VersionSelector';
import RuleComparison from './components/RuleComparison';
import ImportRulesModal from './components/ImportRulesModal';

import useImportRulesData from './hooks/useImportRulesData';

const ImportRules = () => {
  const { policy_id: policyId } = useParams();

  const { error, loading, data } = useImportRulesData({ policyId });
  const { tailorings, securityGuideProfile } = data || {};
  const [comparisonConditions, setComparisonConditions] = useState({});
  const { tailoringId, osMinorVersion } = comparisonConditions;
  const showComparison = tailoringId && osMinorVersion;

  const onComparisonSettingsChange = useCallback((setting, value) => {
    setComparisonConditions((currentComparisonConditions) => ({
      ...currentComparisonConditions,
      [setting]: value,
    }));
  }, []);

  return (
    <ImportRulesModal
      title="Import rules"
      stateValues={{
        error,
        loading,
        data,
      }}
    >
      <Content component={ContentVariants.p}>
        Select which minor RHEL version you would like to import the tailored
        rules from.
      </Content>

      <VersionSelector
        tailorings={tailorings}
        securityGuideProfile={securityGuideProfile}
        onChange={onComparisonSettingsChange}
        canSelectVersionToApply={!!tailoringId}
      />

      {showComparison && (
        <RuleComparison
          policyId={policyId}
          tailoringId={tailoringId}
          securityGuideProfile={securityGuideProfile}
          osMinorVersionToCompare={osMinorVersion}
        />
      )}
    </ImportRulesModal>
  );
};

ImportRules.propTypes = {
  policy: propTypes.object,
  securityGuideProfile: propTypes.object,
};

export default ImportRules;
