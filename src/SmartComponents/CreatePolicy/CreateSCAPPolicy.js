import React from 'react';
import {
    Button,
    Form,
    FormGroup,
    Text,
    TextContent,
    TextVariants,
    Tooltip,
    TooltipPosition
} from '@patternfly/react-core';
import {
    OutlinedQuestionCircleIcon
} from '@patternfly/react-icons';
import { ProfileTypeSelect } from 'PresentationalComponents';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Spinner } from '@redhat-cloud-services/frontend-components';
import { propTypes as reduxFormPropTypes, formValueSelector, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import propTypes from 'prop-types';

const BENCHMARKS_AND_PROFILES = gql`
query benchmarksAndProfiles {
    latestBenchmarks {
        id
        title
        refId
        version
        profiles {
            id
            name
            refId
            description
            complianceThreshold
        }
    }
    profiles(search: "external = false and canonical = false") {
        edges {
            node {
                id
                refId
                benchmarkId
            }
        }
    }
}
`;

const CreateSCAPPolicy = ({ change, selectedBenchmarkId }) => {
    const { data, error, loading } = useQuery(BENCHMARKS_AND_PROFILES, { fetchPolicy: 'no-cache' });

    const userProfileRefIdsForBenchmarkId = (profiles, benchmarkId) => (
        profiles.filter(profile => benchmarkId === profile.node.benchmarkId).map(profile => profile.node.refId)
    );

    if (error) { return error; }

    if (loading) { return <Spinner/>; }

    const benchmarks = data.latestBenchmarks;
    let selectedBenchmark;
    let validProfiles;
    if (selectedBenchmarkId) {
        selectedBenchmark = benchmarks.find(benchmark => benchmark.id === selectedBenchmarkId);
        const userProfileRefIds = userProfileRefIdsForBenchmarkId(data.profiles.edges, selectedBenchmarkId);
        validProfiles = selectedBenchmark.profiles.map((profile) => {
            if (!userProfileRefIds.includes(profile.refId)) {
                return { ...profile };
            } else {
                return { disabled: true, ...profile };
            }
        });
    }

    return (
        <React.Fragment>
            <TextContent>
                <Text component={TextVariants.h1}>
                    Create SCAP policy
                </Text>
                <Text component={TextVariants.h4}>
                    Select the operating system and policy type
                </Text>
            </TextContent>
            <Form>
                <FormGroup
                    label="Operating system"
                    isRequired
                    fieldId="benchmark">
                    <br/>
                    { benchmarks && benchmarks.sort((a, b) => a.refId.localeCompare(b.refId)).map((benchmark) => {
                        const { refId, id } = benchmark;
                        return (
                            <Button key={id} onClick={ () => { change('benchmark', id); } }
                                className={`wizard-os-button ${selectedBenchmarkId === id ? 'active-wizard-os-button' : ''}`}
                                variant="tertiary">
                                { refId && refId.split('xccdf_org.ssgproject.content_benchmark_')[1].replace('-', ' ') }
                            </Button>
                        );
                    })}
                </FormGroup>
                { selectedBenchmark &&
                <Text component={TextVariants.small}>
                    SCAP Security Guide (SSG): { selectedBenchmark.title } - { selectedBenchmark.version }
                    <Tooltip position={TooltipPosition.right} content={`Policies configured in the Compliance services use
                                                                        the latest version of the SSG packaged with RHEL.`}
                    >
                        <span>&nbsp;<OutlinedQuestionCircleIcon className='grey-icon'/></span>
                    </Tooltip>
                </Text>
                }
                <FormGroup label="Policy type" isRequired fieldId="policy-type">
                    <ProfileTypeSelect
                        profiles={selectedBenchmark && validProfiles }
                        onClick={ () => {
                            change('selectedRuleRefIds', null);
                        }}/>
                </FormGroup>
            </Form>
        </React.Fragment>
    );
};

CreateSCAPPolicy.propTypes = {
    selectedBenchmarkId: propTypes.string,
    change: reduxFormPropTypes.change
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
