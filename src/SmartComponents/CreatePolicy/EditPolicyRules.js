import React, { useEffect } from 'react';
import { propTypes as reduxFormPropTypes, formValueSelector, reduxForm } from 'redux-form';
import { SystemRulesTable, ANSIBLE_ICON } from '@redhat-cloud-services/frontend-components-inventory-compliance';
import { EmptyTable, Spinner } from '@redhat-cloud-services/frontend-components';
import { sortable } from '@patternfly/react-table';
import gql from 'graphql-tag';
import { connect } from 'react-redux';
import { compose } from 'redux';
import propTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';

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

export const EditPolicyRules = ({ profileId, benchmarkId, selectedRuleRefIds, dispatch, change }) => {
    const { data, error, loading } = useQuery(QUERY, { variables: { profileId, benchmarkId } });

    useEffect(() => {
        if (data) {
            change('selectedRuleRefIds', data.profile.rules.map((rule) => rule.refId));
        }
    }, [data]);

    if (error) { return error; }

    if (loading) { return <EmptyTable><Spinner/></EmptyTable>; }

    return (
        <SystemRulesTable
            remediationsEnabled={false}
            tailoringEnabled
            selectedFilter
            columns={columns}
            loading={loading}
            handleSelect={((selectedRuleRefIds) => {
                dispatch({
                    type: '@@redux-form/CHANGE',
                    meta: {
                        field: 'selectedRuleRefIds',
                        form: 'policyForm'
                    },
                    payload: selectedRuleRefIds
                });
            })}
            profileRules={ !loading && [{
                profile: { refId: data.profile.refId, name: data.profile.name },
                rules: data.benchmark.rules
            }]}
            selectedRefIds={ selectedRuleRefIds }
        />
    );
};

EditPolicyRules.propTypes = {
    profileId: propTypes.string,
    benchmarkId: propTypes.string,
    dispatch: propTypes.func,
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
