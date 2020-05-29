import React, { useEffect, useState } from 'react';
import { propTypes as reduxFormPropTypes, formValueSelector, reduxForm } from 'redux-form';
import { SystemRulesTable, ANSIBLE_ICON } from '@redhat-cloud-services/frontend-components-inventory-compliance';
import { EmptyTable, Spinner } from '@redhat-cloud-services/frontend-components';
import { Button, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { sortable } from '@patternfly/react-table';
import gql from 'graphql-tag';
import { connect } from 'react-redux';
import { compose } from 'redux';
import propTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import {
    StateViewWithError, StateViewPart
} from 'PresentationalComponents';

const QUERY = gql`
query benchmarkAndProfile($benchmarkId: String!, $profileId: String!){
    benchmark(id: $benchmarkId) {
        rules {
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
        name
        refId
        rules {
            refId
        }
    }
}
`;

const columns = [
    { title: 'Rule', transforms: [sortable] },
    { title: 'Severity', transforms: [sortable] },
    { title: <React.Fragment>{ ANSIBLE_ICON } Ansible</React.Fragment>, transforms: [sortable], original: 'Ansible' }
];

export const EditPolicyRules = ({ profileId, benchmarkId, selectedRuleRefIds, change }) => {
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
    }, [data]);

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
            </TextContent>
            <SystemRulesTable
                remediationsEnabled={ false }
                tailoringEnabled
                selectedFilter
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
    selectedRuleRefIds: propTypes.array
};

const selector = formValueSelector('policyForm');

export default compose(
    connect(
        state => ({
            benchmarkId: selector(state, 'benchmark'),
            profileId: JSON.parse(selector(state, 'profile')).id,
            selectedRuleRefIds: selector(state, 'selectedRuleRefIds')
        })
    ),
    reduxForm({
        form: 'policyForm',
        destroyOnUnmount: false,
        forceUnregisterOnUnmount: true
    })
)(EditPolicyRules);
