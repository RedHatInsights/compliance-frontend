import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Button } from '@patternfly/react-core';
import propTypes from 'prop-types';

const UPDATE_PROFILE = gql`
mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
        profile {
            id,
            complianceThreshold,
            businessObjectiveId
        }
    }
}
`;

const CREATE_BUSINESS_OBJECTIVE = gql`
mutation createBusinessObjective($input: createBusinessObjectiveInput!) {
    createBusinessObjective(input: $input) {
        businessObjective {
            id
            title
        }
    }
}
`;

export class UpdateProfileButton extends React.Component {
    handleBusinessObjective = () => {
        const { businessObjective, editPolicyBusinessObjective, mutate } = this.props;

        if (editPolicyBusinessObjective === undefined) {
            return Promise.resolve(businessObjective ? businessObjective.id : null);
        }

        if (editPolicyBusinessObjective && businessObjective
            && (editPolicyBusinessObjective.value !== businessObjective.id)) {
            return Promise.resolve(editPolicyBusinessObjective.value);
        }

        if (editPolicyBusinessObjective && businessObjective === null) {
            return Promise.resolve(editPolicyBusinessObjective.value);
        }

        if (editPolicyBusinessObjective === null) {
            return Promise.resolve(null);
        }

        if (editPolicyBusinessObjective.create) {
            return mutate({
                mutation: CREATE_BUSINESS_OBJECTIVE,
                variables: { input: { title: editPolicyBusinessObjective.label } }
            }).then((result) => {
                return result.data.createBusinessObjective.businessObjective.id;
            });
        }
    }

    onClick = () => {
        const { mutate, policyId, threshold, onClick } = this.props;

        this.handleBusinessObjective().then((businessObjectiveId) => {
            let input = {
                id: policyId,
                complianceThreshold: parseFloat(threshold)
            };

            if (businessObjectiveId) {
                input.businessObjectiveId = businessObjectiveId;
            }

            return mutate({
                mutation: UPDATE_PROFILE,
                variables: { input }
            });
        }).then(() => {
            onClick();
        });
    }

    render() {
        return (<Button type='submit' variant='primary'
            onClick={this.onClick}>Save</Button>
        );
    }
}

UpdateProfileButton.propTypes = {
    policyId: propTypes.string,
    businessObjective: propTypes.object,
    editPolicyBusinessObjective: propTypes.object,
    mutate: propTypes.func,
    threshold: propTypes.number,
    onClick: propTypes.func
};

const UpdateProfile = graphql(UPDATE_PROFILE)(UpdateProfileButton);
export default UpdateProfile;
