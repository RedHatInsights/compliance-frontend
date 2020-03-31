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
import { SubmitPoliciesButton } from './SubmitPoliciesButton';
import gql from 'graphql-tag';
import { reset, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';

const QUERY = gql`
query systemWithProfiles($search: String!){
    systems(search: $search) {
        nodes {
            id
            name
            profiles {
                id
                name
            }
        }
    }
    profiles {
        nodes {
            id
            name
        }
    }
}
`;

const isSystemAssignedToProfile = (system, id) => (
    system.profiles.map(profile => profile.id).includes(id)
);

const AssignPoliciesModal = ({ isModalOpen, toggle, fqdn, id, selectedPolicyIds, dispatch }) => {
    // Display all policies with the same OS as host
    const { data, error, loading } = useQuery(QUERY, { variables: { search: 'id=' + id } });

    if (error) { return <ErrorPage error={error}/>; }

    if (loading) { return <React.Fragment/>; }

    const system = data.systems.nodes.length === 1 && data.systems.nodes[0];
    const options = data.profiles.nodes.map((policy) => (
        {
            label: policy.name,
            value: policy.id,
            defaultChecked: system && isSystemAssignedToProfile(system, policy.id)
        }
    ));

    return (
        <Modal
            isSmall
            title={`Edit policies for ${fqdn}`}
            isOpen={isModalOpen}
            isFooterLeftAligned
            onClose={() => { dispatch(reset('assignPolicies')); toggle(true); }}
            actions={[
                <SubmitPoliciesButton key='save'
                    aria-label='save'
                    toggle={toggle}
                    systemId={id}
                    dispatch={dispatch}
                    policyIds={selectedPolicyIds}
                    variant='primary' />,
                <Button key='cancel' aria-label='cancel' variant='secondary'
                    onClick={() => { dispatch(reset('assignPolicies')); toggle(true); }}>
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
            <br/>
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
