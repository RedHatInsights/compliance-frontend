import React from 'react';
import {
    EmptyState, EmptyStateBody, Text, TextContent, Title
} from '@patternfly/react-core';
import propTypes from 'prop-types';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import EmptyTable from '@redhat-cloud-services/frontend-components/EmptyTable';
import Spinner from '@redhat-cloud-services/frontend-components/Spinner';
import { StateViewWithError, StateViewPart, TabbedRules } from 'PresentationalComponents';
import {
    useBenchmarksQuery, useTabsData, useProfilesQuery
} from './hooks';

const EditPolicyRulesTabEmptyState = () => <EmptyState>
    <Title headingLevel="h5" size="lg">
        No rules can be configured
    </Title>
    <EmptyStateBody>
        This policy has no associated systems, and therefore no rules can be configured.
    </EmptyStateBody>
    <EmptyStateBody>
        Add at least one system to configure rules for this policy.
    </EmptyStateBody>
</EmptyState>;

export const EditPolicyRulesField = (props) => {
    const { input } = useFieldApi(props);
    const {
        FieldProps: { policy, osMinorVersionCounts }
    } = props;
    const toTabsData = useTabsData(policy, osMinorVersionCounts);
    const selectedRuleRefIds = JSON.parse(input.value);

    const {
        data: benchmarksData,
        error: benchmarksError,
        loading: benchmarksLoading
    } = useBenchmarksQuery(policy, osMinorVersionCounts);
    const benchmarks = benchmarksData?.benchmarks?.nodes;

    const tabsData = toTabsData(benchmarks, selectedRuleRefIds);

    const {
        data: profilesData, error: profilesError, loading: profilesLoading
    } = useProfilesQuery(tabsData);

    const loadingState = ((profilesLoading || benchmarksLoading) ? true : undefined);
    const dataState = ((!loadingState && tabsData?.length > 0) ? profilesData : undefined);
    const error = benchmarksError || profilesError;

    const handleSelect = ({ id: profileId }, rules) => {
        const updatedProfileRules = selectedRuleRefIds.map((ruleSet) => {
            if (ruleSet.id === profileId) {
                return { ...ruleSet, ruleRefIds: rules };
            } else {
                return ruleSet;
            }
        });

        input.onChange(JSON.stringify(updatedProfileRules));
    };

    return <StateViewWithError stateValues={ {
        error,
        data: !error && dataState,
        loading: loadingState,
        empty: !loadingState && !dataState && !error
    } }>
        <StateViewPart stateKey="loading">
            <EmptyTable><Spinner/></EmptyTable>
        </StateViewPart>
        <StateViewPart stateKey="data">
            <TextContent>
                <Text>
                    Different release versions of RHEL are associated with different versions of
                    the SCAP Security Guide (SSG), therefore each release must be customized independently.
                </Text>
            </TextContent>
            <TabbedRules
                tabsData={ tabsData }
                remediationsEnabled={ false }
                selectedFilter
                level={ 1 }
                handleSelect={ handleSelect } />
        </StateViewPart>
        <StateViewPart stateKey="empty">
            <EditPolicyRulesTabEmptyState />
        </StateViewPart>
    </StateViewWithError>;
};

EditPolicyRulesField.propTypes = {
    policy: propTypes.object,
    osMinorVersionCounts: propTypes.shape({
        osMinorVersion: propTypes.shape({
            osMinorVersion: propTypes.number,
            count: propTypes.number
        })
    }),
    FieldProps: propTypes.object
};

export default EditPolicyRulesField;
