import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Button } from '@patternfly/react-core';
import propTypes from 'prop-types';

class UpdateProfileButton extends React.Component {
    onClick = () => {
        const { mutate, policyId, threshold } = this.props;
        mutate({
            variables: {
                /* eslint-disable camelcase */
                input: {
                    id: policyId,
                    compliance_threshold: parseFloat(threshold)
                }
                /* eslint-disable camelcase */
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
    UpdateProfile(input: $input) {
        profile {
            id,
            compliance_threshold
        }
    }
}
`;

UpdateProfileButton.propTypes = {
    policyId: propTypes.string,
    mutate: propTypes.function,
    threshold: propTypes.number
};

const UpdateProfileThreshold = graphql(UPDATE_THRESHOLD)(UpdateProfileButton);
export default UpdateProfileThreshold;
