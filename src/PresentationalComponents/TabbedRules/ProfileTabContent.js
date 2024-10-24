import React, { useState } from 'react';
import propTypes from 'prop-types';
import { gql, useQuery } from '@apollo/client';
import {
  Text,
  TextVariants,
  TextContent,
  Grid,
  Spinner,
  Badge,
  Popover,
  Flex,
  FlexItem,
} from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import {
  StateViewWithError,
  StateViewPart,
  SupportedSSGVersionsLink,
  RulesTable,
  LinkWithPermission as Link,
} from 'PresentationalComponents';
import { pluralize } from 'Utilities/TextHelper';
import OsVersionText from './OsVersionText';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import ResetRules from '../ResetRules/ResetRules';

export const ProfileSystemCount = ({ count = 0 }) => (
  <Badge isRead>{`${count} ${pluralize(count, 'system')}`}</Badge>
);

ProfileSystemCount.propTypes = {
  profile: propTypes.object,
  count: propTypes.number,
};

export const SSGVersionText = ({ profile, newOsMinorVersion }) => (
  <Text component={TextVariants.p}>
    SSG version: {profile?.benchmark.version}{' '}
    <Popover
      position="right"
      bodyContent={<SSGPopoverBody {...{ profile, newOsMinorVersion }} />}
      footerContent={<SupportedSSGVersionsLink />}
    >
      <span style={{ cursor: 'pointer' }}>
        <OutlinedQuestionCircleIcon className="grey-icon" />
      </span>
    </Popover>
  </Text>
);

SSGVersionText.propTypes = {
  profile: propTypes.object.isRequired,
  newOsMinorVersion: propTypes.string,
};

const SSGPopoverBody = ({ profile, newOsMinorVersion }) => (
  <TextContent style={{ fontSize: 'var(--pf-v5-c-popover--FontSize)' }}>
    <Text>
      This is the latest supported version of the SCAP Security Guide (SSG) for{' '}
      <OsVersionText {...{ profile, newOsMinorVersion }} />
    </Text>
    <Text>
      <OsVersionText {...{ profile, newOsMinorVersion }} /> systems assigned to
      this policy will report using this rule list.
    </Text>
  </TextContent>
);

SSGPopoverBody.propTypes = {
  profile: propTypes.object.isRequired,
  newOsMinorVersion: propTypes.string,
};

export const BENCHMARK_QUERY = gql`
  query PTC_Benchmark($id: String!) {
    benchmark(id: $id) {
      id
      osMajorVersion
      rules {
        id
        title
        severity
        rationale
        refId
        description
        remediationAvailable
        identifier
        values
      }
    }
  }
`;

const ProfileTabContent = ({
  profile,
  columns,
  handleSelect,
  systemCount,
  selectedRuleRefIds,
  rulesTableProps,
  newOsMinorVersion,
  resetLink,
  rulesPageLink,
  setRuleValues,
  ruleValues,
  onRuleValueReset,
}) => {
  const {
    data: benchmark,
    error,
    loading,
  } = useQuery(BENCHMARK_QUERY, {
    variables: {
      id: profile.benchmark.id,
    },
    skip: !handleSelect || !profile.benchmark?.id,
  });
  const rules = handleSelect ? benchmark?.benchmark?.rules : profile?.rules;
  const [originalRules, setOriginalRules] = useState([]);

  return (
    <React.Fragment>
      <Grid>
        <TextContent className="pf-v5-u-mt-md">
          <Text component={TextVariants.h3}>
            <span className="pf-v5-u-pr-sm">
              <OsVersionText {...{ profile, newOsMinorVersion }} />
            </span>
            <ProfileSystemCount count={systemCount} />
          </Text>
          <Flex>
            <FlexItem>
              <SSGVersionText {...{ profile, newOsMinorVersion }} />
            </FlexItem>
            <FlexItem align={{ default: 'alignRight' }}>
              {rulesPageLink && (
                <Link
                  to={`/scappolicies/${profile?.id}/default_ruleset`}
                  target="_blank"
                  className="pf-v5-u-mr-xl"
                >
                  View policy rules
                  <ExternalLinkAltIcon className="pf-v5-u-ml-sm" />
                </Link>
              )}
              {resetLink && (
                <ResetRules
                  handleSelect={handleSelect}
                  updateRules={setOriginalRules}
                  profile={profile}
                  newOsMinorVersion={newOsMinorVersion}
                  originalRules={originalRules}
                  loading={loading}
                  selectedRuleRefIds={selectedRuleRefIds}
                />
              )}
            </FlexItem>
          </Flex>
        </TextContent>
      </Grid>
      <StateViewWithError stateValues={{ error, loading, rules }}>
        <StateViewPart stateKey="loading">
          <Spinner />
        </StateViewPart>
        <StateViewPart stateKey="rules">
          <RulesTable
            ansibleSupportFilter
            remediationsEnabled={false}
            columns={columns}
            profileRules={[
              {
                profile,
                rules: rules || [],
                valueDefinitions: profile?.benchmark?.valueDefinitions,
                ruleValues,
              },
            ]}
            selectedRules={selectedRuleRefIds.map(
              (refId) => `${profile.id}|${refId}`
            )}
            handleSelect={
              handleSelect &&
              ((selectedRuleRefIds) =>
                handleSelect(
                  profile,
                  newOsMinorVersion,
                  selectedRuleRefIds.map(
                    (profileRuleRefId) => profileRuleRefId.split('|')[1]
                  )
                ))
            }
            setRuleValues={setRuleValues}
            onRuleValueReset={onRuleValueReset}
            {...rulesTableProps}
          />
        </StateViewPart>
      </StateViewWithError>
    </React.Fragment>
  );
};

ProfileTabContent.propTypes = {
  profile: propTypes.object,
  newOsMinorVersion: propTypes.string,
  columns: propTypes.array,
  handleSelect: propTypes.func,
  systemCount: propTypes.number,
  selectedRuleRefIds: propTypes.array,
  rulesTableProps: propTypes.object,
  resetLink: propTypes.bool,
  rulesPageLink: propTypes.bool,
  setRuleValues: propTypes.func,
  ruleValues: propTypes.array,
  onRuleValueReset: propTypes.func,
};

export default ProfileTabContent;
