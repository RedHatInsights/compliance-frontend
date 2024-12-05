import React, { useCallback } from 'react';
import propTypes from 'prop-types';
import { propTypes as reduxFormPropTypes } from 'redux-form';
import { useDeepCompareEffectNoCheck } from 'use-deep-compare-effect';

import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateHeader,
  Spinner,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import {
  StateViewPart,
  StateViewWithError,
  Tailorings,
} from '../../../PresentationalComponents';
import * as Columns from '@/PresentationalComponents/RulesTable/Columns';
import useProfileRuleIds from './useProfileRuleIds';

export const EditPolicyProfilesRulesRest = ({
  policy,
  selectedRuleRefIds,
  change,
  osMajorVersion,
  osMinorVersionCounts,
}) => {
  const preselected =
    selectedRuleRefIds &&
    (selectedRuleRefIds || []).reduce(
      (prev, cur) => ({
        ...prev,
        [cur.osMinorVersion]: cur.ruleRefIds,
      }),
      {}
    );
  const profileRefId = policy?.refId;

  const skipFetchingProfileRuleIds =
    !osMajorVersion ||
    !profileRefId ||
    (osMinorVersionCounts || []).length === 0;

  const {
    profilesAndRuleIds,
    loading: preselectedRuleIdsLoading,
    error: preselectedRuleIdsError,
  } = useProfileRuleIds({
    profileRefId,
    osMajorVersion,
    osMinorVersions: osMinorVersionCounts.map(
      ({ osMinorVersion }) => osMinorVersion
    ),
    skip: skipFetchingProfileRuleIds,
  });

  const onSelect = useCallback(
    (
      _securityGuideId,
      { os_minor_version: osMinorVersion },
      newSelectedRuleIds
    ) => {
      const updatedSelectedRuleRefIds = structuredClone(
        selectedRuleRefIds || []
      );

      if (updatedSelectedRuleRefIds.length === 0) {
        if (newSelectedRuleIds.length === 0) {
          return;
        }

        updatedSelectedRuleRefIds.push({
          osMinorVersion,
          ruleRefIds: newSelectedRuleIds,
        });
      } else {
        const index = updatedSelectedRuleRefIds.findIndex(
          ({ osMinorVersion: _osMinorVersion }) =>
            _osMinorVersion === osMinorVersion
        );

        updatedSelectedRuleRefIds[index].ruleRefIds = newSelectedRuleIds;
      }
      change('selectedRuleRefIds', updatedSelectedRuleRefIds);
    },
    [change, selectedRuleRefIds]
  );

  useDeepCompareEffectNoCheck(() => {
    if (profilesAndRuleIds !== undefined && selectedRuleRefIds === undefined) {
      change(
        'selectedRuleRefIds',
        osMinorVersionCounts.map(({ osMinorVersion }) => ({
          osMinorVersion,
          ruleRefIds: profilesAndRuleIds.find(
            ({ osMinorVersion: profileOsMinorVersion }) =>
              profileOsMinorVersion === osMinorVersion
          ).ruleIds,
        }))
      );
    }
  }, [change, osMinorVersionCounts, profilesAndRuleIds, selectedRuleRefIds]);

  const noRuleSets =
    !preselectedRuleIdsError &&
    !preselectedRuleIdsLoading &&
    Object.keys(profilesAndRuleIds || {}).length === 0;

  return !preselected ? (
    <Bullseye>
      <Spinner />
    </Bullseye>
  ) : (
    <React.Fragment>
      <TextContent className="pf-v5-u-pb-md">
        <Text component={TextVariants.h1}>Rules</Text>
        <Text>
          Customize your <b>{policy.name}</b> SCAP policy by including and
          excluding rules.
        </Text>
        <Text>
          Each release of RHEL is supported with a unique and specific version
          of the SCAP Security Guide (SSG). You must customize each version of
          SSG for each release of RHEL.
        </Text>
      </TextContent>
      <StateViewWithError
        stateValues={{
          error: preselectedRuleIdsError,
          data: profilesAndRuleIds,
          loading: preselectedRuleIdsLoading,
          noRuleSets,
        }}
      >
        <StateViewPart stateKey="noRuleSets">
          <EmptyState>
            <EmptyStateHeader
              titleText="No rules can be configured"
              headingLevel="h1"
            />
            <EmptyStateBody>
              The policy type selected does not exist for the systems and OS
              versions selected in the previous steps.
            </EmptyStateBody>
          </EmptyState>
        </StateViewPart>
        <StateViewPart stateKey="loading">
          <EmptyState>
            <Spinner />
          </EmptyState>
        </StateViewPart>
        <StateViewPart stateKey="data">
          <Tailorings
            profiles={profilesAndRuleIds}
            columns={[Columns.Name, Columns.Severity, Columns.Remediation]}
            onSelect={onSelect}
            preselected={preselected}
            enableSecurityGuideRulesToggle
            rulesPageLink={true}
            defaultTableView="rows"
          />
        </StateViewPart>
      </StateViewWithError>
    </React.Fragment>
  );
};

EditPolicyProfilesRulesRest.propTypes = {
  policy: propTypes.object,
  change: reduxFormPropTypes.change,
  osMajorVersion: propTypes.string,
  osMinorVersionCounts: propTypes.arrayOf(
    propTypes.shape({
      osMinorVersion: propTypes.number,
      count: propTypes.number,
    })
  ),
  selectedRuleRefIds: propTypes.array,
  ruleValues: propTypes.array,
};

export default EditPolicyProfilesRulesRest;
