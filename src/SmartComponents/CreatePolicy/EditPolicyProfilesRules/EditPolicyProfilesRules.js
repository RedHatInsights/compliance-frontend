import React, { useCallback } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  Bullseye,
  EmptyState,
  Spinner,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import propTypes from 'prop-types';
import {
  formValueSelector,
  reduxForm,
  propTypes as reduxFormPropTypes,
} from 'redux-form';
import { useDeepCompareEffectNoCheck } from 'use-deep-compare-effect';
import {
  StateViewPart,
  StateViewWithError,
  Tailorings,
} from '@/PresentationalComponents';
import * as Columns from '@/PresentationalComponents/RulesTable/Columns';
import useProfileRuleIds from './useProfileRuleIds';

const EditPolicyProfilesRules = ({
  profile,
  selectedRuleRefIds,
  change,
  osMajorVersion,
  osMinorVersionCounts,
  valueOverrides = {},
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
  const profileRefId = profile?.ref_id;

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

  const setRules = (osMinorVersionToChange, ruleIds) => {
    if (ruleIds != null) {
      change(
        'selectedRuleRefIds',
        selectedRuleRefIds.map(({ osMinorVersion, ruleRefIds }) => {
          return {
            osMinorVersion,
            ruleRefIds:
              osMinorVersion === osMinorVersionToChange ? ruleIds : ruleRefIds,
          };
        })
      );
    }
  };

  const getDefaultRulesByMinorVersion = (osMinorVersionToFind) => {
    return (
      profilesAndRuleIds.find(
        ({ osMinorVersion: profileOsMinorVersion }) =>
          profileOsMinorVersion === osMinorVersionToFind
      )?.ruleIds || []
    );
  };

  const onResetRules = (osMinorVersionToReset) => {
    if (profilesAndRuleIds !== undefined && selectedRuleRefIds !== undefined) {
      const newRules = getDefaultRulesByMinorVersion(osMinorVersionToReset);
      setRules(osMinorVersionToReset, newRules);
    }
  };

  const onSelect = useCallback(
    (
      _securityGuideId,
      { os_minor_version: osMinorVersion },
      newSelectedRuleIds
    ) => setRules(osMinorVersion, newSelectedRuleIds),
    [change, selectedRuleRefIds]
  );

  useDeepCompareEffectNoCheck(() => {
    if (profilesAndRuleIds !== undefined && selectedRuleRefIds === undefined) {
      change(
        'selectedRuleRefIds',
        osMinorVersionCounts.map(({ osMinorVersion }) => ({
          osMinorVersion,
          ruleRefIds: getDefaultRulesByMinorVersion(osMinorVersion),
        }))
      );
    }
  }, [change, osMinorVersionCounts, profilesAndRuleIds, selectedRuleRefIds]);

  const onValueOverrideSave = (
    _policy,
    osMinorVersion,
    valueDefinition,
    valueOverrideValue,
    closeInlineEdit
  ) => {
    let valueOverridesUpdated = structuredClone(valueOverrides);

    if (valueOverrideValue === '' || valueOverrideValue === undefined) {
      delete valueOverridesUpdated?.[osMinorVersion]?.[valueDefinition.id];
    } else {
      valueOverridesUpdated = {
        ...valueOverrides,
        [osMinorVersion]: {
          ...valueOverrides[osMinorVersion],
          [valueDefinition.id]: valueOverrideValue,
        },
      };
    }

    change('valueOverrides', valueOverridesUpdated);
    closeInlineEdit();
  };

  return !preselected ? (
    <Bullseye>
      <Spinner />
    </Bullseye>
  ) : (
    <React.Fragment>
      <TextContent className="pf-v5-u-pb-md">
        <Text component={TextVariants.h1}>Rules</Text>
        <Text>
          Customize your <b>{profile.title}</b> SCAP policy by including and
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
        }}
      >
        <StateViewPart stateKey="loading">
          <EmptyState>
            <Spinner />
          </EmptyState>
        </StateViewPart>
        <StateViewPart stateKey="data">
          <Tailorings
            profiles={profilesAndRuleIds}
            columns={[Columns.Name, Columns.Severity, Columns.Remediation]}
            ouiaId="RHELVersions"
            onSelect={onSelect}
            preselected={preselected}
            enableSecurityGuideRulesToggle
            rulesPageLink={true}
            valueOverrides={valueOverrides}
            onValueOverrideSave={onValueOverrideSave}
            onRuleReset={onResetRules}
            selectedVersionCounts={osMinorVersionCounts.reduce(
              (prev, cur) => ({
                ...prev,
                [cur.osMinorVersion]: cur.count,
              }),
              {}
            )}
          />
        </StateViewPart>
      </StateViewWithError>
    </React.Fragment>
  );
};

EditPolicyProfilesRules.propTypes = {
  profile: propTypes.object,
  change: reduxFormPropTypes.change,
  osMajorVersion: propTypes.string,
  osMinorVersionCounts: propTypes.arrayOf(
    propTypes.shape({
      osMinorVersion: propTypes.number,
      count: propTypes.number,
    })
  ),
  selectedRuleRefIds: propTypes.array,
  valueOverrides: propTypes.object,
};

const selector = formValueSelector('policyForm');

export default compose(
  connect((state) => ({
    profile: selector(state, 'profile'),
    osMajorVersion: selector(state, 'osMajorVersion'),
    osMinorVersionCounts: selector(state, 'osMinorVersionCounts'),
    selectedRuleRefIds: selector(state, 'selectedRuleRefIds'),
    valueOverrides: selector(state, 'valueOverrides'),
  })),
  reduxForm({
    form: 'policyForm',
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
  })
)(EditPolicyProfilesRules);
