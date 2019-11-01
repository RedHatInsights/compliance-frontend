import React from 'react';
import { compose } from 'redux';
import { Field, reduxForm } from 'redux-form';
import { FormGroup, Title } from '@patternfly/react-core';
import propTypes from 'prop-types';
import { ReduxFormCreatableSelectInput } from '../ReduxFormWrappers/ReduxFormWrappers';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';

const GET_BUSINESS_OBJECTIVES = gql`
query businessObjectives {
    businessObjectives {
        id
        title
    }
}
`;

class BusinessObjectiveField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            policyId: props.policyId,
            isExpanded: false,
            selected: props.businessObjective ? this.createOption(props.businessObjective) : '',
            options: [],
            originalOptions: [],
            client: props.client,
            isLoading: true
        };

        // Resetting the cache is necessary to reload the list of Business Objectives
        // after removing or adding any.
        props.client.cache.reset();
        props.client.query({
            query: GET_BUSINESS_OBJECTIVES
        }).then((items) => {
            const options = items.data.businessObjectives.map(businessObjective => (
                this.createOption(businessObjective)
            ));
            options.push({ label: 'None', value: null });

            this.setState({
                isLoading: false,
                options,
                originalOptions: options
            });
        });
    }

    createOption = (businessObjective) => ({
        label: businessObjective.title,
        value: businessObjective.id
    });

    handleInputChange = debounce(value => {
        this.handleCreate(value);
    }, 500)

    handleChange = (newValue) => {
        this.setState({ selected: newValue });
    };

    handleCreate = (inputValue) => {
        const { originalOptions } = this.state;

        if (inputValue.length === 0 || originalOptions.map(option => option.label).indexOf(inputValue) !== -1) {
            return;
        }

        const { dispatch } = this.props;
        this.setState({ isLoading: true });

        let newOption = this.createOption({ title: inputValue, value: inputValue });
        newOption.create = true;

        // Manually dispatch the action to ensure the newly created label is set
        dispatch({
            type: '@@redux-form/CHANGE',
            meta: {
                field: 'businessObjective',
                form: 'editPolicy'
            },
            payload: newOption
        });
        this.setState({
            isLoading: false,
            options: [newOption, ...originalOptions],
            selected: newOption
        });
    };

    render() {
        const { isLoading, selected, options } = this.state;
        const titleId = 'business-objective-typeahead';

        return (
            <React.Fragment>
                <Title headingLevel='h3' size='xl'>Business objective</Title>
                This is an optional field that can be used to label policies that are related to
                specific business objectives.
                <FormGroup field-id='edit-policy-business-objective'
                    label="Business objective"
                    helperText='e.g Project Gemini'>
                    <Field name='businessObjective'
                        id='businessObjective'
                        ariaLabelledBy={titleId}
                        aria-label="Select a business objective"
                        component={ReduxFormCreatableSelectInput}
                        isClearable
                        selected={selected}
                        placeholder='Type to select and create'
                        isDisabled={isLoading}
                        isLoading={isLoading}
                        onChange={this.handleChange}
                        onCreateOption={this.handleCreate}
                        onInputChange={this.handleInputChange}
                        options={options}
                    />
                </FormGroup>
            </React.Fragment>
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
