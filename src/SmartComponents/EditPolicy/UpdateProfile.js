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

class UpdateProfileButton extends React.Component {
    onClick = () => {
        const { mutate, policyId, threshold, businessObjective, onClick } = this.props;
        let businessObjectivePromise;
        if (businessObjective && businessObjective.create) {
            businessObjectivePromise = mutate({
                mutation: CREATE_BUSINESS_OBJECTIVE,
                variables: { input: { title: businessObjective.label } }
            });
        } else {
            businessObjectivePromise = Promise.resolve(
                { data: { createBusinessObjective: { businessObjective: { id: businessObjective.value } } } }
            );
        }

        businessObjectivePromise.then((result) => {
            mutate({
                mutation: UPDATE_PROFILE,
                variables: {
                    input: {
                        id: policyId,
                        complianceThreshold: parseFloat(threshold),
                        businessObjectiveId: result && result.data.createBusinessObjective.businessObjective.id
                    }
                }
            })
            .then(() => {
                onClick();
            });
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
    mutate: propTypes.func,
    threshold: propTypes.number,
    onClick: propTypes.func
};

const UpdateProfile = graphql(UPDATE_PROFILE)(UpdateProfileButton);
export default UpdateProfile;
