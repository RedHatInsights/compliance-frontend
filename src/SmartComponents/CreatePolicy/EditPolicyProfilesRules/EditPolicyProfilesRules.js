import React, { useCallback } from 'react';
import xor from 'lodash/xor';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { useDeepCompareEffect } from 'use-deep-compare';
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
  const additionalRules =
    profilesAndRuleIds &&
    selectedRuleRefIds?.reduce((additions, profileAndRules) => {
      const originalRules = profilesAndRuleIds.find(
        ({ osMinorVersion }) =>
          osMinorVersion === profileAndRules.osMinorVersion
      ).ruleIds;

      return {
        ...additions,
        [profileAndRules.osMinorVersion]: xor(
          profileAndRules.ruleRefIds,
          originalRules
        ),
      };
    }, {});

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

  useDeepCompareEffect(() => {
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
            skipProfile="create-policy"
            profiles={profilesAndRuleIds}
            additionalRules={additionalRules}
            columns={[Columns.Name, Columns.Severity, Columns.Remediation]}
            ouiaId="RHELVersions"
            onSelect={onSelect}
            preselected={preselected}
            enableSecurityGuideRulesToggle
            rulesPageLink={true}
            valueOverrides={valueOverrides}
            onValueOverrideSave={onValueOverrideSave}
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
