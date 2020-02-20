import React from 'react';
import propTypes from 'prop-types';
import { CheckboxGroup, ErrorPage } from 'PresentationalComponents';
import {
    Modal,
    Text,
    TextContent,
    Button
} from '@patternfly/react-core';
import { useQuery } from '@apollo/react-hooks';
import SubmitPoliciesButton from './SubmitPoliciesButton';
import gql from 'graphql-tag';
import { reset, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';

const QUERY = gql`
query systemWithProfiles($id: String!){
    system(id: $id) {
        id
        name
        profiles {
            id
            name
        }
    }
    profiles {
        edges {
            node {
                id
                name
            }
        }
    }
}
`;

const isSystemAssignedToProfile = (system, id) => (
    system.profiles.map(profile => profile.id).includes(id)
);

const AssignPoliciesModal = ({ isModalOpen, toggle, fqdn, id, selectedPolicyIds, dispatch }) => {
    // Display all policies with the same OS as host
    const { data, error, loading } = useQuery(QUERY, { variables: { id } });

    if (error) { return <ErrorPage error={error}/>; }

    if (loading) { return <React.Fragment/>; }

    const options = data.profiles.edges.map((policy) => (
        {
            label: policy.node.name,
            value: policy.node.id,
            defaultChecked: isSystemAssignedToProfile(data.system, policy.node.id)
        }
    ));

    return (
        <Modal
            isSmall
            title={`Edit policies for ${fqdn}`}
            isOpen={isModalOpen}
            onClose={() => { dispatch(reset('assignPolicies')); toggle(); }}
            actions={[
                <SubmitPoliciesButton key='save'
                    aria-label='save'
                    toggle={toggle}
                    system={data.system}
                    dispatch={dispatch}
                    policyIds={selectedPolicyIds}
                    variant='primary' />,
                <Button key='cancel' aria-label='cancel' variant='secondary'
                    onClick={() => { dispatch(reset('assignPolicies')); toggle(); }}>
                    Cancel
                </Button>
            ]}
        >
            <TextContent>
                <Text>
                    Choose which policies {fqdn} should be a part of. Note: Only policies for this
                    host operating system are shown.
                </Text>
            </TextContent>
            <TextContent>
                <Text>
                    <CheckboxGroup name='policies' options={options} />
                </Text>
            </TextContent>
        </Modal>
    );
};

AssignPoliciesModal.propTypes = {
    isModalOpen: propTypes.bool,
    toggle: propTypes.func,
    id: propTypes.string,
    fqdn: propTypes.string,
    selectedPolicyIds: propTypes.arrayOf(propTypes.string),
    dispatch: propTypes.func
};

const selector = formValueSelector('assignPolicies');

export default compose(
    connect(
        state => ({
            selectedPolicyIds: selector(state, 'policies')
        })
    ),
    reduxForm({
        form: 'assignPolicies'
    })
)(AssignPoliciesModal);
