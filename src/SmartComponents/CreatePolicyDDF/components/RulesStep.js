import React, { useCallback, useEffect } from 'react';
import { xor, isEqual } from 'lodash';
import { useDeepCompareEffect } from 'use-deep-compare';
import {
  Bullseye,
  EmptyState,
  Spinner,
  Content,
  ContentVariants,
} from '@patternfly/react-core';
import propTypes from 'prop-types';
import { useFormApi, FormSpy } from '@data-driven-forms/react-form-renderer';
import {
  StateViewPart,
  StateViewWithError,
  Tailorings,
} from '@/PresentationalComponents';
import * as Columns from '@/PresentationalComponents/RulesTable/Columns';
import useProfileRuleIds from '../../CreatePolicy/EditPolicyProfilesRules/useProfileRuleIds';
import { resetRuleValueOverrides } from '@/Utilities/helpers';

const RulesStepContent = ({
  profile,
  selectedRuleRefIds,
  osMinorVersionCounts,
  valueOverrides = {},
}) => {
  const { change } = useFormApi();
  const osMajorVersion = profile?.os_major_version;

  const selected =
    selectedRuleRefIds &&
    (selectedRuleRefIds || []).reduce(
      (prev, cur) => ({
        ...prev,
        [cur.osMinorVersion]: cur.ruleRefIds,
      }),
      {},
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
    osMinorVersions: osMinorVersionCounts?.map(
      ({ osMinorVersion }) => osMinorVersion,
    ),
    skip: skipFetchingProfileRuleIds,
  });

  useEffect(() => {
    if (profilesAndRuleIds) {
      change('rules-validation', 'valid');
    } else {
      change('rules-validation', 'pending');
    }
  }, [profilesAndRuleIds, change]);

  const preselected =
    profilesAndRuleIds !== undefined
      ? osMinorVersionCounts.reduce(
          (acc, cur) => ({
            ...acc,
            [cur.osMinorVersion]: profilesAndRuleIds.find(
              ({ osMinorVersion }) => osMinorVersion === cur.osMinorVersion,
            ).ruleIds,
          }),
          {},
        )
      : undefined;

  const additionalRules =
    profilesAndRuleIds &&
    selectedRuleRefIds?.reduce((additions, profileAndRules) => {
      const originalRules =
        profilesAndRuleIds.find(
          ({ osMinorVersion }) =>
            osMinorVersion === profileAndRules.osMinorVersion,
        )?.ruleIds || [];

      return {
        ...additions,
        [profileAndRules.osMinorVersion]: xor(
          profileAndRules.ruleRefIds,
          originalRules,
        ),
      };
    }, {});

  const onSelect = useCallback(
    (
      _securityGuideId,
      { os_minor_version: osMinorVersion },
      newSelectedRuleIds,
    ) => {
      const updatedSelectedRuleRefIds = structuredClone(
        selectedRuleRefIds || [],
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
            _osMinorVersion === osMinorVersion,
        );
        if (
          isEqual(
            updatedSelectedRuleRefIds[index].ruleRefIds,
            newSelectedRuleIds,
          )
        ) {
          return;
        }
        updatedSelectedRuleRefIds[index].ruleRefIds = newSelectedRuleIds;
      }
      change('selectedRuleRefIds', updatedSelectedRuleRefIds);
    },
    [change, selectedRuleRefIds],
  );

  useDeepCompareEffect(() => {
    const newSelectedRuleRefIds = osMinorVersionCounts?.reduce(
      (accum, { osMinorVersion }) => {
        if (
          selectedRuleRefIds?.some(
            (entry) => entry.osMinorVersion === osMinorVersion,
          )
        ) {
          return accum;
        }
        const refIdsPerMinorVersion = profilesAndRuleIds?.find(
          ({ osMinorVersion: profileOsMinorVersion }) =>
            profileOsMinorVersion === osMinorVersion,
        ).ruleIds;

        return [
          ...accum,
          ...(refIdsPerMinorVersion?.length
            ? [{ osMinorVersion, ruleRefIds: refIdsPerMinorVersion }]
            : []),
        ];
      },
      [],
    );
    if (newSelectedRuleRefIds?.length !== 0) {
      change('selectedRuleRefIds', [
        ...(selectedRuleRefIds || []),
        ...newSelectedRuleRefIds,
      ]);
    }
  }, [change, osMinorVersionCounts, profilesAndRuleIds, selectedRuleRefIds]);

  const onValueOverrideSave = (
    _policy,
    osMinorVersion,
    valueDefinition,
    valueOverrideValue,
    closeInlineEdit,
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

  const onRuleValueReset = (osMinorVersion, ruleValues) => {
    const valueOverridesUpdated = resetRuleValueOverrides(
      valueOverrides,
      osMinorVersion,
      ruleValues,
    );

    change('valueOverrides', valueOverridesUpdated);
  };

  return !preselected ? (
    <Bullseye>
      <Spinner />
    </Bullseye>
  ) : (
    <React.Fragment>
      <Content className="pf-v6-u-pb-md">
        <Content component={ContentVariants.h1}>Rules</Content>
        <Content component="p">
          Customize your <b>{profile.title}</b> SCAP policy by including and
          excluding rules.
        </Content>
        <Content component="p">
          Each release of RHEL is supported with a unique and specific version
          of the SCAP Security Guide (SSG). You must customize each version of
          SSG for each release of RHEL.
        </Content>
      </Content>
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
          {profilesAndRuleIds &&
            Object.keys(preselected || {}).length ===
              osMinorVersionCounts.length && (
              <Tailorings
                skipProfile="create-policy"
                profiles={profilesAndRuleIds}
                additionalRules={additionalRules}
                columns={[Columns.Name, Columns.Severity, Columns.Remediation]}
                ouiaId="RHELVersions"
                onSelect={onSelect}
                showResetButton
                selected={{
                  ...selected,
                  ...preselected,
                }}
                enableSecurityGuideRulesToggle
                rulesPageLink={true}
                valueOverrides={valueOverrides}
                onValueOverrideSave={onValueOverrideSave}
                onRuleValueReset={onRuleValueReset}
                selectedVersionCounts={osMinorVersionCounts.reduce(
                  (prev, cur) => ({
                    ...prev,
                    [cur.osMinorVersion]: cur.count,
                  }),
                  {},
                )}
              />
            )}
        </StateViewPart>
      </StateViewWithError>
    </React.Fragment>
  );
};

RulesStepContent.propTypes = {
  profile: propTypes.object,
  osMinorVersionCounts: propTypes.arrayOf(
    propTypes.shape({
      osMinorVersion: propTypes.number,
      count: propTypes.number,
    }),
  ),
  selectedRuleRefIds: propTypes.array,
  valueOverrides: propTypes.object,
};

const RulesStep = () => (
  <FormSpy subscription={{ values: true }}>
    {({ values }) => (
      <RulesStepContent
        profile={values.profile}
        osMinorVersionCounts={values.osMinorVersionCounts}
        selectedRuleRefIds={values.selectedRuleRefIds}
        valueOverrides={values.valueOverrides}
      />
    )}
  </FormSpy>
);

export default RulesStep;
