import React from 'react';
import { formValueSelector, reduxForm } from 'redux-form';
import { SystemRulesTable, ANSIBLE_ICON } from '@redhat-cloud-services/frontend-components-inventory-compliance';
import { EmptyTable, Spinner } from '@redhat-cloud-services/frontend-components';
import { sortable } from '@patternfly/react-table';
import gql from 'graphql-tag';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Query } from 'react-apollo';
import propTypes from 'prop-types';

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
            identifier {
                label
                system
            }
        }
    }
}
`;

const columns = [
    { title: 'Rule', transforms: [sortable] },
    { title: 'Policy', transforms: [sortable] },
    { title: 'Severity', transforms: [sortable] },
    { title: <React.Fragment>{ ANSIBLE_ICON } Ansible</React.Fragment>, transforms: [sortable], original: 'Ansible' }
];

const EditPolicyRules = ({ profileId }) => (
    <Query query={ QUERY } variables={{ profileId }}>
        { ({ data, error, loading }) => {
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
        } }
    </Query>
);

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
