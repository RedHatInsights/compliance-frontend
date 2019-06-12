import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Button } from '@patternfly/react-core';
import propTypes from 'prop-types';

class UpdateProfileButton extends React.Component {
    onClick = () => {
        const { mutate, policyId, threshold, businessObjectiveId } = this.props;
        mutate({
            variables: {
                input: {
                    id: policyId,
                    complianceThreshold: parseFloat(threshold),
                    businessObjectiveId
                }
            }
        })
        .then(() => {
            document.location.reload();
        });
    }

    render() {
        return (<Button type='submit' variant='primary'
            onClick={this.onClick}>Save</Button>
        );
    }
}

const UPDATE_THRESHOLD = gql`
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

UpdateProfileButton.propTypes = {
    policyId: propTypes.string,
    businessObjectiveId: propTypes.string,
    mutate: propTypes.function,
    threshold: propTypes.number
};

const UpdateProfile = graphql(UPDATE_THRESHOLD)(UpdateProfileButton);
export default UpdateProfile;
