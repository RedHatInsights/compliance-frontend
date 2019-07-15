import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { FormGroup } from '@patternfly/react-core';
import propTypes from 'prop-types';
import { ReduxFormCreatableSelectInput } from '../ReduxFormWrappers/ReduxFormWrappers';
import gql from 'graphql-tag';
import { compose, withApollo } from 'react-apollo';
import { connect } from 'react-redux';

const GET_BUSINESS_OBJECTIVES = gql`
query businessObjectives {
    businessObjectives {
        id
        title
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

class BusinessObjectiveField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            policyId: props.policyId,
            isExpanded: false,
            originalValue: props.businessObjective ? props.businessObjective.title : 'e.g: China expansion',
            selected: props.businessObjective ? props.businessObjective.id : '',
            options: [],
            client: props.client,
            isLoading: true
        };

        props.client.query({
            query: GET_BUSINESS_OBJECTIVES
        }).then((items) => {
            const options = items.data.businessObjectives.map(businessObjective => (
                this.createOption(businessObjective)
            ));
            options.push({ label: 'None', value: null });

            this.setState({
                isLoading: false,
                options
            });
        });
    }

    createOption = (businessObjective) => ({
        label: businessObjective.title,
        value: businessObjective.id
    });

    handleChange = (newValue) => {
        this.setState({ selected: newValue });
    };

    handleCreate = (inputValue) => {
        const { client, options } = this.state;
        const { dispatch } = this.props;
        this.setState({ isLoading: true });

        client.mutate({
            mutation: CREATE_BUSINESS_OBJECTIVE,
            variables: { input: { title: inputValue } }
        }).then((result) => {
            const newOption = this.createOption(result.data.createBusinessObjective.businessObjective);
            // Manually dispatch the action to ensure the newly created label is set
            dispatch({
                type: '@@redux-form/CHANGE',
                meta: {
                    field: 'businessObjectiveId',
                    form: 'editPolicy'
                },
                payload: newOption
            });
            this.setState({
                isLoading: false,
                options: [newOption, ...options],
                selected: newOption
            });
        });
    };

    render() {
        const { isLoading, originalValue, selected, options } = this.state;
        const titleId = 'business-objective-typeahead';

        return (
            <FormGroup fieldId='policy-business-objective'
                label="Business objective">
                <Field name='businessObjectiveId'
                    id='businessObjectiveId'
                    ariaLabelledBy={titleId}
                    aria-label="Select a business objective"
                    component={ReduxFormCreatableSelectInput}
                    isClearable
                    selected={selected}
                    placeholder={originalValue}
                    isDisabled={isLoading}
                    isLoading={isLoading}
                    onChange={this.handleChange}
                    onCreateOption={this.handleCreate}
                    options={options}
                />
            </FormGroup>
        );
    }
}

BusinessObjectiveField.propTypes = {
    policyId: propTypes.string,
    businessObjective: propTypes.object,
    client: propTypes.object,
    dispatch: propTypes.function
};

export default compose(
    connect(),
    withApollo,
    reduxForm({
        form: 'editPolicy'
    })
)(BusinessObjectiveField);
