import React from 'react';
import { formValueSelector, reduxForm } from 'redux-form';
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
            title
            severity
            rationale
            refId
            description
            remediationAvailable
            identifier
        }
    }
}
`;

const columns = [
    { title: 'Rule', transforms: [sortable] },
    { title: 'Severity', transforms: [sortable] },
    { title: <React.Fragment>{ ANSIBLE_ICON } Ansible</React.Fragment>, transforms: [sortable], original: 'Ansible' }
];

export const EditPolicyRules = ({ profileId, benchmarkId }) => {
    const { data, error, loading } = useQuery(QUERY, { variables: { profileId, benchmarkId } });

    if (error) { return error; }

    if (loading) { return <EmptyTable><Spinner/></EmptyTable>; }

    // Figure out pre-selected rules by computing the list of data.benchmark.rules - data.profiles.rules
    const unselected = data.benchmark.rules.filter(value => !data.profile.rules.map(rule => rule.refId).includes(value.refId));
    const selected = data.profile.rules.map((rule) => rule.refId);

    return (
        <SystemRulesTable
            remediationsEnabled={false}
            tailoringEnabled={true}
            columns={columns}
            loading={loading}
            profileRules={ !loading && [{
                profile: { refId: data.profile.refId, name: data.profile.name },
                rules: unselected
            }]}
            selectedRefIds={selected}
        />
    );
};

EditPolicyRules.propTypes = {
    profileId: propTypes.string,
    benchmarkId: propTypes.string
};

const selector = formValueSelector('policyForm');

export default compose(
    connect(
        state => ({
            benchmarkId: selector(state, 'benchmark'),
            profileId: JSON.parse(selector(state, 'profile')).id
        })
    ),
    reduxForm({
        form: 'policyForm',
        destroyOnUnmount: false,
        forceUnregisterOnUnmount: true
    })
)(EditPolicyRules);
