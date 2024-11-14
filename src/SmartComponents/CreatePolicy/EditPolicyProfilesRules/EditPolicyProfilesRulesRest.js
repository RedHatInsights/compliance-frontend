import React, { useCallback, useEffect, useMemo } from 'react';
import propTypes from 'prop-types';
import { propTypes as reduxFormPropTypes } from 'redux-form';
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
import useSecurityGuides from '../../../Utilities/hooks/api/useSecurityGuides';
import * as Columns from '@/PresentationalComponents/RulesTable/Columns';
import useProfileRuleIds from './useProfileRuleIds';

export const EditPolicyProfilesRulesRest = ({
  policy,
  selectedRuleRefIds,
  change,
  osMajorVersion,
  osMinorVersionCounts,
}) => {
  const hasCachedSelection = selectedRuleRefIds !== undefined;
  const preselected = useMemo(
    () =>
      (selectedRuleRefIds || []).reduce(
        (prev, cur) => ({
          ...prev,
          [cur.osMinorVersion]: cur.ruleRefIds,
        }),
        {}
      ),
    [selectedRuleRefIds]
  );

  const {
    data: securityGuideData,
    loading: securityGuideLoading,
    error: securityGuideError,
  } = useSecurityGuides({
    params: [
      undefined,
      1,
      undefined,
      true,
      'version:desc', // get the latest security guide for the chosen profile
      `os_major_version=${osMajorVersion} AND profile_ref_id=${policy.refId}`,
    ],
  });

  const skipFetchingProfileRuleIds =
    hasCachedSelection ||
    securityGuideLoading ||
    securityGuideData === undefined;
  const {
    profileRuleIds,
    loading: preselectedRuleIdsLoading,
    error: preselectedRuleIdsError,
  } = useProfileRuleIds(
    securityGuideData?.data?.[0]?.id,
    policy.id,
    skipFetchingProfileRuleIds
  );

  const onSelect = useCallback(
    (_securityGuideId, osMinorVersion, newSelectedRuleIds) => {
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

  useEffect(() => {
    // set initial selection
    if (
      !hasCachedSelection &&
      preselectedRuleIdsLoading === false &&
      profileRuleIds !== undefined
    ) {
      change(
        'selectedRuleRefIds',
        osMinorVersionCounts.map(({ osMinorVersion }) => ({
          osMinorVersion,
          ruleRefIds: profileRuleIds,
        }))
      );
    }
  }, [
    change,
    hasCachedSelection,
    onSelect,
    osMinorVersionCounts,
    preselectedRuleIdsLoading,
    profileRuleIds,
  ]);

  const noRuleSets =
    !securityGuideError &&
    !preselectedRuleIdsError &&
    !securityGuideLoading &&
    !preselectedRuleIdsLoading &&
    profileRuleIds?.length === 0;

  const viewLoading =
    securityGuideData === undefined ||
    securityGuideLoading ||
    (!hasCachedSelection &&
      (profileRuleIds === undefined || preselectedRuleIdsLoading));

  return viewLoading ? (
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
          error: securityGuideError || preselectedRuleIdsError,
          data: securityGuideData || profileRuleIds,
          loading: securityGuideLoading || preselectedRuleIdsLoading,
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
            securityGuideId={securityGuideData.data[0].id}
            osMinorVersions={osMinorVersionCounts.map(
              ({ osMinorVersion }) => osMinorVersion
            )}
            columns={[Columns.Name, Columns.Severity, Columns.Remediation]}
            onSelect={onSelect}
            preselected={preselected}
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
