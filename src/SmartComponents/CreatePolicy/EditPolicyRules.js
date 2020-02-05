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
query Profile($profileId: String!){
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

export const EditPolicyRules = ({ profileId }) => {
    const { data, error, loading } = useQuery(QUERY, { variables: { profileId } });

    if (error) { return error; }

    if (loading) { return <EmptyTable><Spinner/></EmptyTable>; }

    return (
        <SystemRulesTable
            remediationsEnabled={false}
            columns={columns}
            loading={loading}
            profileRules={ !loading && [{
                profile: { refId: data.profile.refId, name: data.profile.name },
                rules: data.profile.rules
            }]}
        />
    );
};

EditPolicyRules.propTypes = {
    profileId: propTypes.string
};

const selector = formValueSelector('policyForm');

export default compose(
    connect(
        state => ({
            profileId: JSON.parse(selector(state, 'profile')).id
        })
    ),
    reduxForm({
        form: 'policyForm',
        destroyOnUnmount: false,
        forceUnregisterOnUnmount: true
    })
)(EditPolicyRules);
