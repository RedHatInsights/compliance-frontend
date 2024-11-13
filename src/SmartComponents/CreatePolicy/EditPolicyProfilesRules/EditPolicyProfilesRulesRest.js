import React, { useEffect } from 'react';
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
  selectedRuleRefIds = [],
  change,
  osMajorVersion,
  osMinorVersionCounts,
}) => {
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
  const {
    profileRuleIds,
    loading: preselectedRuleIdsLoading,
    error: preselectedRuleIdsError,
  } = useProfileRuleIds(
    securityGuideData?.data?.[0]?.id,
    policy.id,
    securityGuideLoading || securityGuideData === undefined
  );

  const onSelect = (_securityGuideId, osMinorVersion, newSelectedRuleIds) => {
    const updatedSelectedRuleRefIds = selectedRuleRefIds;

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

      if (newSelectedRuleIds.length === 0) {
        // should completely remove the entry from the list if none selected
        updatedSelectedRuleRefIds.splice(index, 1);
      } else {
        updatedSelectedRuleRefIds[index].ruleRefIds = newSelectedRuleIds;
      }
    }
    change('selectedRuleRefIds', updatedSelectedRuleRefIds);
  };

  useEffect(() => {
    // set initial selection
    if (preselectedRuleIdsLoading === false && profileRuleIds !== undefined) {
      osMinorVersionCounts.forEach(({ osMinorVersion }) => {
        onSelect(undefined, osMinorVersion, profileRuleIds);
      });
    }
  }, [profileRuleIds, preselectedRuleIdsLoading, osMinorVersionCounts]);

  const noRuleSets =
    !securityGuideError &&
    !preselectedRuleIdsError &&
    !securityGuideLoading &&
    !preselectedRuleIdsLoading &&
    profileRuleIds?.length === 0;

  return securityGuideData === undefined ||
    profileRuleIds === undefined ||
    securityGuideLoading ||
    preselectedRuleIdsLoading ? (
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
            preselected={selectedRuleRefIds.reduce(
              (prev, cur) => ({
                ...prev,
                [cur.osMinorVersion]: cur.ruleRefIds,
              }),
              {}
            )}
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
