import React from 'react';
import { graphql } from '@apollo/react-hoc';
import { Button } from '@patternfly/react-core';
import propTypes from 'prop-types';
import { UPDATE_PROFILE } from 'Utilities/graphql/mutations';
import businessObjectiveMutation from 'Utilities/businessObjectiveMutation';

export class UpdateProfileButton extends React.Component {
    onClick = () => {
        const { businessObjective, editPolicyBusinessObjective, mutate, policyId, threshold, onClick } = this.props;

        return businessObjectiveMutation(businessObjective, editPolicyBusinessObjective, mutate).then(businessObjectiveId => {
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
    policyId: propTypes.string.isRequired,
    businessObjective: propTypes.object,
    editPolicyBusinessObjective: propTypes.object,
    mutate: propTypes.func.isRequired,
    threshold: propTypes.number,
    onClick: propTypes.func.isRequired
};

export default graphql(UPDATE_PROFILE)(UpdateProfileButton);
