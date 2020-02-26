import React from 'react';
import { compose } from 'redux';
import { Field, reduxForm } from 'redux-form';
import { FormGroup, Title } from '@patternfly/react-core';
import propTypes from 'prop-types';
import { ReduxFormCreatableSelectInput } from 'PresentationalComponents/ReduxFormWrappers/ReduxFormWrappers';
import gql from 'graphql-tag';
import { withApollo } from '@apollo/react-hoc';

const GET_BUSINESS_OBJECTIVES = gql`
query businessObjectives {
    businessObjectives {
        id
        title
    }
}
`;

export class BusinessObjectiveField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: props.businessObjective ? this.createOption(props.businessObjective) : null
        };
    }

    loadOptions = (title) => {
        const variables = title ? { title } : {};
        this.props.client.cache.reset();
        return this.props.client.query({
            query: GET_BUSINESS_OBJECTIVES,
            variables
        }).then((items) => {
            return items.data.businessObjectives.map(businessObjective => (
                this.createOption(businessObjective)
            ));
        });
    }

    createOption = (businessObjective) => ({
        label: businessObjective.title,
        value: businessObjective.id
    });

    handleChange = (newValue) => {
        const { dispatch } = this.props;
        this.setState({ selected: newValue });

        // Manually dispatch the action to ensure the newly created label is set
        dispatch({
            type: '@@redux-form/CHANGE',
            meta: {
                field: 'businessObjective',
                form: 'policyForm'
            },
            payload: newValue
        });
    };

    handleCreate = (inputValue) => {
        let newOption = this.createOption({ title: inputValue, value: inputValue });
        newOption.create = true;
        this.handleChange(newOption);
    };

    render() {
        const { selected } = this.state;
        const { showTitle } = this.props;
        const titleId = 'business-objective-typeahead';
        const title = <React.Fragment>
            <Title headingLevel='h3' size='xl'>Business objective</Title>
            This is an optional field that can be used to label policies that are related to
            specific business objectives.
        </React.Fragment>;

        return (
            <React.Fragment>
                { showTitle && title }
                <FormGroup fieldId='edit-policy-business-objective'
                    label="Business objective"
                    helperText='e.g Project Gemini'>
                    <Field name='businessObjective'
                        id='businessObjective'
                        ariaLabelledBy={titleId}
                        aria-label="Select a business objective"
                        component={ReduxFormCreatableSelectInput}
                        isClearable
                        placeholder='Type to select and create'
                        onChange={this.handleChange}
                        onCreateOption={this.handleCreate}
                        loadOptions={this.loadOptions}
                        selected={selected}
                    />
                </FormGroup>
            </React.Fragment>
        );
    }
}

BusinessObjectiveField.propTypes = {
    businessObjective: propTypes.object,
    client: propTypes.object,
    dispatch: propTypes.func,
    showTitle: propTypes.bool
};

BusinessObjectiveField.defaultProps = {
    showTitle: true
};

export default compose(
    withApollo,
    reduxForm({
        form: 'policyForm'
    })
)(BusinessObjectiveField);
