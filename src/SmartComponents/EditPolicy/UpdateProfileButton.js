import React from 'react';
import { graphql } from '@apollo/react-hoc';
import { Button } from '@patternfly/react-core';
import propTypes from 'prop-types';
import { CREATE_BUSINESS_OBJECTIVE, UPDATE_PROFILE } from '../../Utilities/graphql/mutations';

export class UpdateProfileButton extends React.Component {
    handleBusinessObjective = () => {
        const { businessObjective, editPolicyBusinessObjective, mutate } = this.props;

        if (editPolicyBusinessObjective === undefined) {
            return Promise.resolve(businessObjective ? businessObjective.id : null);
        }

        if (editPolicyBusinessObjective && !editPolicyBusinessObjective.create && businessObjective
            && (editPolicyBusinessObjective.value !== businessObjective.id)) {
            return Promise.resolve(editPolicyBusinessObjective.value);
        }

        if (editPolicyBusinessObjective && !editPolicyBusinessObjective.create
            && businessObjective === null) {
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

        return this.handleBusinessObjective().then((businessObjectiveId) => {
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
