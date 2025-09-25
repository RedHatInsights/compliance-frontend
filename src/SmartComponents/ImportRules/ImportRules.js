import React from 'react';
import propTypes from 'prop-types';
import { useParams, useLocation } from 'react-router-dom';
import {
  Content,
  ContentVariants,
  Skeleton,
  Spinner,
  Bullseye,
} from '@patternfly/react-core';

import VersionSelector from './components/VersionSelector';
import RuleComparison from './components/RuleComparison';
import ImportRulesModal from './components/ImportRulesModal';
import useImportRulesData from './hooks/useImportRulesData';
import useComparisonConditions from './hooks/useComparisonConditions';
import useTailoringRuleSelection from './hooks/useTailoringRuleSelection';
import useSaveTailoring from './hooks/useSaveTailoring';

const ImportRules = () => {
  const { policy_id: policyId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const preSelectedTargetVersion = queryParams.get('target_version');

  const {
    loading: importRulesDataLoading,
    error: importRulesDataError,
    data: { tailorings, securityGuideProfile, policy } = {},
  } = useImportRulesData({ policyId });

  const {
    comparisonConditions: { tailoringId, osMinorVersion },
    tailoring: tailoringToCompare,
    sourceVersion,
    targetVersion,
    onComparisonSettingsChange,
  } = useComparisonConditions({
    tailorings,
    securityGuideProfile,
    preSelectedTargetVersion,
  });

  const {
    loading: initialSelectionLoading,
    initialSelection,
    selection,
    onSelect,
    error: initialSelectionError,
  } = useTailoringRuleSelection({ tailoringId, policyId, osMinorVersion });

  const onSave = useSaveTailoring({
    policyId,
    osMinorVersion,
    selection,
    tailorings,
  });
  const isSaveDisabled = !selection || !osMinorVersion;

  const loading = importRulesDataLoading;
  const error = importRulesDataError || initialSelectionError;
  const data = !!tailorings && !!securityGuideProfile && !!policy;

  return (
    <ImportRulesModal
      policyId={policyId}
      title={
        importRulesDataLoading ? (
          <Skeleton />
        ) : (
          'Import rules for ' + policy.title
        )
      }
      stateValues={{
        error,
        loading,
        data,
      }}
      isSaveDisabled={isSaveDisabled}
      onSave={onSave}
    >
      <Content component={ContentVariants.p}>
        Select which minor RHEL version you would like to import the tailored
        rules from.
      </Content>

      <VersionSelector
        tailorings={tailorings}
        securityGuideProfile={securityGuideProfile}
        values={{ tailoringId, osMinorVersion }}
        onChange={onComparisonSettingsChange}
        preSelectedTargetVersion={preSelectedTargetVersion}
      />

      {policy && tailoringToCompare && osMinorVersion && (
        <>
          <Content component={ContentVariants.hr} />
          {initialSelectionLoading || !initialSelection || !selection ? (
            <Bullseye>
              <Spinner />
            </Bullseye>
          ) : (
            <RuleComparison
              policy={policy}
              tailoring={tailoringToCompare}
              sourceVersion={sourceVersion}
              targetVersion={targetVersion}
              securityGuideProfile={securityGuideProfile}
              osMinorVersionToCompare={osMinorVersion}
              initialSelection={initialSelection}
              selection={selection}
              onSelect={onSelect}
            />
          )}
        </>
      )}
    </ImportRulesModal>
  );
};

ImportRules.propTypes = {
  policy: propTypes.object,
  securityGuideProfile: propTypes.object,
};

export default ImportRules;
