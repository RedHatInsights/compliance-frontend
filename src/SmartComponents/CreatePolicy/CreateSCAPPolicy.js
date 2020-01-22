import React from 'react';
import {
    Form,
    FormGroup,
    Text,
    TextContent,
    TextVariants
} from '@patternfly/react-core';
import { ProfileTypeSelect } from 'PresentationalComponents';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Spinner } from '@redhat-cloud-services/frontend-components';
import { formValueSelector, Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import propTypes from 'prop-types';

const ALL_BENCHMARKS = gql`
query allBenchmarks{
    allBenchmarks {
        id,
        title,
        version,
        profiles {
            id
            name
            refId
            description
            complianceThreshold
        }
    }
}
`;

const CreateSCAPPolicy = ({ selectedBenchmarkId }) => {
    const { data, error, loading } = useQuery(ALL_BENCHMARKS);

    if (error) { return error; }

    if (loading) { return <Spinner/>; }

    const benchmarks = data.allBenchmarks;
    let selectedBenchmark;
    if (selectedBenchmarkId) {
        selectedBenchmark = benchmarks.find(benchmark => benchmark.id === selectedBenchmarkId);
    }

    return (
        <React.Fragment>
            <TextContent>
                <Text component={TextVariants.h1}>
                    Create SCAP policy
                </Text>
                <Text component={TextVariants.h4}>
                    Select the security guide and profile type for this policy.
                </Text>
            </TextContent>
            <Form>
                <FormGroup
                    label="Security guide"
                    isRequired
                    fieldId="benchmark">
                    { benchmarks && benchmarks.map((benchmark) => {
                        const { title, version, id } = benchmark;
                        return (
                            <Text key={id}>
                                <Field component='input'
                                    name='benchmark'
                                    type='radio'
                                    value={id}
                                    id={id}
                                />
                                {` ${title} - ${version}`}
                            </Text>
                        );
                    })}
                </FormGroup>
                <FormGroup label="Profile type" isRequired fieldId="profile-type">
                    <ProfileTypeSelect profiles={selectedBenchmark && selectedBenchmark.profiles} />
                </FormGroup>
            </Form>
        </React.Fragment>
    );
};

CreateSCAPPolicy.propTypes = {
    selectedBenchmarkId: propTypes.string
};

const selector = formValueSelector('policyForm');

export default compose(
    connect(
        state => ({
            selectedBenchmarkId: selector(state, 'benchmark')
        })
    ),
    reduxForm({
        form: 'policyForm',
        destroyOnUnmount: false,
        forceUnregisterOnUnmount: true
    })
)(CreateSCAPPolicy);
