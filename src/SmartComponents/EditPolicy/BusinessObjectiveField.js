import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { FormGroup } from '@patternfly/react-core';
import propTypes from 'prop-types';
import { ReduxFormCreatableSelectInput } from '../ReduxFormWrappers/ReduxFormWrappers';
import gql from 'graphql-tag';
import { compose, withApollo } from 'react-apollo';
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
            originalValue: props.businessObjective ? props.businessObjective.title : 'e.g: China expansion',
            selected: props.businessObjective ? props.businessObjective.id : '',
            options: [],
            originalOptions: [],
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
        if (inputValue.length === 0) {
            return;
        }

        const { originalOptions } = this.state;
        const { dispatch } = this.props;
        this.setState({ isLoading: true });

        const newOption = this.createOption({ title: inputValue, id: inputValue });
        // Manually dispatch the action to ensure the newly created label is set
        dispatch({
            type: '@@redux-form/CHANGE',
            meta: {
                field: 'businessObjectiveTitle',
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
        const { isLoading, originalValue, selected, options } = this.state;
        const titleId = 'business-objective-typeahead';

        return (
            <FormGroup field-id='edit-policy-business-objective' label="Business objective">
                <Field name='businessObjectiveTitle'
                    id='businessObjectiveTitle'
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
                    onInputChange={this.handleInputChange}
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
