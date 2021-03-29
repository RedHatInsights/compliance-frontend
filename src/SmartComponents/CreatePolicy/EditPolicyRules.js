import React, { useEffect, useState } from 'react';
import { propTypes as reduxFormPropTypes, formValueSelector, reduxForm } from 'redux-form';
import SystemRulesTable, {
    selectColumns as selectRulesTableColumns
} from '@redhat-cloud-services/frontend-components-inventory-compliance/SystemRulesTable';
import EmptyTable from '@redhat-cloud-services/frontend-components/EmptyTable';
import Spinner from '@redhat-cloud-services/frontend-components/Spinner';
import { Button, Text, TextContent, TextVariants } from '@patternfly/react-core';
import gql from 'graphql-tag';
import { connect } from 'react-redux';
import { compose } from 'redux';
import propTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { StateViewWithError, StateViewPart } from 'PresentationalComponents';
import useFeature from 'Utilities/hooks/useFeature';
import EditPolicyProfilesRules from './EditPolicyProfilesRules';

const QUERY = gql`
query benchmarkAndProfile($benchmarkId: String!, $profileId: String!){
    benchmark(id: $benchmarkId) {
        id
        rules {
            id
            title
            severity
            rationale
            refId
            description
            remediationAvailable
            identifier
        }
    }
    profile(id: $profileId) {
        id
        name
        refId
        rules {
            id
            refId
        }
    }
}
`;

export const EditPolicyRules = ({ profileId, benchmarkId, osMajorVersion, osMinorVersionCounts, selectedRuleRefIds, change }) => {
    const multiversionRules = useFeature('multiversionTabs');
    const columns = selectRulesTableColumns(['Name', 'Severity', 'Ansible']);
    const { data, error, loading } = useQuery(QUERY, { variables: { profileId, benchmarkId } });
    const [defaultSelection, setDefaultSelection] = useState(null);
    const profileRules = data && [{
        profile: { refId: data.profile.refId, name: data.profile.name },
        rules: data.benchmark.rules
    }];
    const resetToDefaultSelection = () => (
        change('selectedRuleRefIds', defaultSelection)
    );
    const isDefaultSelection = (ruleIds) => {
        const filteredRules = ruleIds?.filter((ruleId) => (defaultSelection?.includes(ruleId)));
        return ruleIds && defaultSelection && filteredRules.length === defaultSelection.length;
    };

    useEffect(() => {
        if (data) {
            const ruleIds = data.profile.rules.map((rule) => rule.refId);
            setDefaultSelection(ruleIds);
            if (!selectedRuleRefIds) {
                change('selectedRuleRefIds', ruleIds);
            }
        }
    }, [data, change, selectedRuleRefIds]);

    return <StateViewWithError stateValues={ { error, data, loading } }>
        <StateViewPart stateKey="loading">
            <EmptyTable><Spinner/></EmptyTable>
        </StateViewPart>
        <StateViewPart stateKey="data">
            <TextContent>
                <Text component={TextVariants.h1}>
                    Rules
                </Text>
            </TextContent>
            <TextContent>
                <Text>
                    Edit your policy by including and excluding rules.
                </Text>
                <Text>
                    Selected policy type <strong>{ data?.profile.name }</strong> has { defaultSelection?.length } rules.&ensp;
                    { selectedRuleRefIds && !isDefaultSelection(selectedRuleRefIds) &&
                        <Button variant="link" isInline onClick={ () => resetToDefaultSelection() }>
                          Reset to default selection
                        </Button>
                    }
                </Text>
                { multiversionRules && osMinorVersionCounts && osMinorVersionCounts.length > 0 &&
                    <Text>
                        Tailoring for{' '}
                        { osMinorVersionCounts.map(({ osMinorVersion, count }) =>
                            `RHEL ${osMajorVersion}.${osMinorVersion} (${count} systems)`).join(', ') }
                    </Text>
                }
            </TextContent>
            <SystemRulesTable
                remediationsEnabled={ false }
                tailoringEnabled
                selectedFilter
                remediationAvailableFilter
                columns={ columns }
                loading={ loading }
                handleSelect={ (selectedRuleRefIds) => change('selectedRuleRefIds', selectedRuleRefIds) }
                profileRules={ profileRules }
                selectedRefIds={ selectedRuleRefIds || [] }
            />
        </StateViewPart>
    </StateViewWithError>;
};

EditPolicyRules.propTypes = {
    profileId: propTypes.string,
    benchmarkId: propTypes.string,
    change: reduxFormPropTypes.change,
    osMajorVersion: propTypes.string,
    osMinorVersionCounts: propTypes.arrayOf(propTypes.shape({
        osMinorVersion: propTypes.number,
        count: propTypes.number
    })),
    selectedRuleRefIds: propTypes.array
};

const selector = formValueSelector('policyForm');

const EditPolicyRulesComponent = compose(
    connect(
        state => ({
            benchmarkId: selector(state, 'benchmark'),
            profile: JSON.parse(selector(state, 'profile')),
            profileId: JSON.parse(selector(state, 'profile')).id,
            osMajorVersion: selector(state, 'osMajorVersion'),
            osMinorVersionCounts: selector(state, 'osMinorVersionCounts'),
            selectedRuleRefIds: selector(state, 'selectedRuleRefIds')
        })
    ),
    reduxForm({
        form: 'policyForm',
        destroyOnUnmount: false,
        forceUnregisterOnUnmount: true
    })
)(EditPolicyRules);

const FeatureWrapper = (...props) => {
    const multiversionRules = useFeature('multiversionTabs');
    const Component = multiversionRules ? EditPolicyProfilesRules : EditPolicyRulesComponent;

    return <Component { ...props } />;
};

export default FeatureWrapper;
